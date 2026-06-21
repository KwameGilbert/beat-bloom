import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Music, 
  DollarSign, 
  Play, 
  ArrowRight, 
  Users, 
  UploadCloud, 
  Wallet, 
  ArrowUpRight, 
  FileText, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Percent,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBalanceStore } from "@/store/balanceStore";
import { useAuthStore } from "@/store/authStore";
import producerService from "@/lib/producer";
import type { DashboardOverviewResponse } from "@/lib/producer";

export default function ProducerOverview() {
  const [chartMetric, setChartMetric] = useState<"revenue" | "plays">("revenue");
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const { showBalance, toggleBalance } = useBalanceStore();
  const { user } = useAuthStore();

  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await producerService.getDashboardOverview();
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const activeChartData = useMemo(() => {
    if (!data) return [];
    return chartMetric === "revenue" ? data.chartPointsRevenue : data.chartPointsPlays;
  }, [chartMetric, data]);

  const maxVal = useMemo(() => {
    if (activeChartData.length === 0) return 100;
    const max = Math.max(...activeChartData.map(p => p.value));
    return max > 0 ? max * 1.15 : 100;
  }, [activeChartData]);

  // Dimension values for responsive SVG
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  // Generate responsive point coordinates
  const points = useMemo(() => {
    if (activeChartData.length === 0) return [];
    return activeChartData.map((p, i) => {
      const x = padding.left + (i * (chartWidth - padding.left - padding.right)) / (activeChartData.length - 1);
      const y = chartHeight - padding.bottom - (p.value / maxVal) * (chartHeight - padding.top - padding.bottom);
      return { x, y, ...p };
    });
  }, [activeChartData, maxVal]);

  const linePath = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    return `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;
  }, [points, linePath]);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Calculate threshold percentage
  const threshold = 50;
  const availableBal = data.stats.availableBalance;
  const thresholdProgress = Math.min(100, Math.round((availableBal / threshold) * 100));

  return (
    <div className="space-y-6 p-6 md:p-8 pb-24 text-left font-sans">
      
      {/* 1. Welcome Creator Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-card/20 p-6 shadow-md">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 select-none pointer-events-none hidden md:block">
          <Sparkles className="h-32 w-32 text-orange-500" />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-500 border border-orange-500/20">
              Verified Creator
            </span>
            <span className="flex h-5 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 border border-emerald-500/20">
              PRO Account
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-foreground sm:text-3xl tracking-tight">
            Welcome back, {user?.name || "Creator"}!
          </h1>
          <p className="max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your beat catalog is performing exceptionally well. You've earned <span className="font-bold text-foreground text-orange-500">{showBalance ? `$${availableBal.toFixed(2)}` : "$ *,***.**"}</span> cleared balance ready for payout.
          </p>
        </div>
      </div>

      {/* 2. Key Business Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue (Net)"
          value={showBalance ? `$${data.stats.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$ *,***.**"}
          change={12.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
        />
        <StatsCard
          title="Beats Sold"
          value={String(data.stats.totalSales)}
          change={8.0}
          changeLabel="vs last week"
          icon={<Music className="h-5 w-5" />}
          trend="up"
        />
        <StatsCard
          title="Total Plays"
          value={data.stats.totalPlays >= 1000 ? `${(data.stats.totalPlays / 1000).toFixed(1)}K` : String(data.stats.totalPlays)}
          change={24.3}
          changeLabel="vs last week"
          icon={<Play className="h-5 w-5" />}
          trend="up"
        />
        <StatsCard
          title="Active Listeners"
          value={data.stats.activeListeners.toLocaleString()}
          change={15.2}
          changeLabel="vs last month"
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />
      </div>

      {/* 3. Main Split Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Side: Analytics Graph & Recent Sales Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue/Plays Chart Card */}
          <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md p-6 shadow-md space-y-6 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-foreground text-lg">Performance Analytics</h3>
                <p className="text-xs text-muted-foreground">Detailed graph of your shop performance this month</p>
              </div>
              
              {/* Metric Toggles */}
              <div className="flex bg-secondary/40 rounded-lg p-1 self-start sm:self-center border border-border/40">
                <button
                  onClick={() => setChartMetric("revenue")}
                  className={cn(
                    "rounded px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5",
                    chartMetric === "revenue"
                      ? "bg-background text-orange-500 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Revenue
                </button>
                <button
                  onClick={() => setChartMetric("plays")}
                  className={cn(
                    "rounded px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5",
                    chartMetric === "plays"
                      ? "bg-background text-orange-500 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Play className="h-3.5 w-3.5" />
                  Plays
                </button>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="relative w-full h-[220px]">
              {points.length > 0 ? (
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  className="w-full h-full select-none"
                >
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
                    return (
                      <line
                        key={index}
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke="currentColor"
                        className="text-border/45"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Shaded Area Under Line */}
                  <path d={areaPath} fill="url(#chartGlow)" />

                  {/* Stroke Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Hover Dots & Invisible Trigger Zones */}
                  {points.map((p, i) => (
                    <g key={i}>
                      {/* Visual Dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredPoint?.label === p.label ? 6 : 4}
                        fill={hoveredPoint?.label === p.label ? "#f97316" : "var(--background)"}
                        stroke="#f97316"
                        strokeWidth={2}
                        className="transition-all duration-150"
                      />
                      {/* Hover hotspot */}
                      <rect
                        x={p.x - 20}
                        y={padding.top}
                        width={40}
                        height={chartHeight - padding.top - padding.bottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}

                  {/* X-Axis labels */}
                  {points.map((p, i) => {
                    // Only render every second/third label to avoid cluttering
                    if (i % 3 !== 0 && i !== points.length - 1) return null;
                    return (
                      <text
                        key={i}
                        x={p.x}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        className="text-[10px] fill-muted-foreground/80 font-semibold"
                      >
                        {p.label}
                      </text>
                    );
                  })}

                  {/* Y-Axis scale label indicators */}
                  <text
                    x={padding.left - 8}
                    y={padding.top + 4}
                    textAnchor="end"
                    className="text-[10px] fill-muted-foreground/85 font-semibold"
                  >
                    {chartMetric === "revenue" ? `$${Math.round(maxVal)}` : Math.round(maxVal)}
                  </text>
                  <text
                    x={padding.left - 8}
                    y={chartHeight - padding.bottom + 4}
                    textAnchor="end"
                    className="text-[10px] fill-muted-foreground/85 font-semibold"
                  >
                    0
                  </text>
                </svg>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No performance analytics data available yet.
                </div>
              )}

              {/* HTML Floating Tooltip overlay */}
              {hoveredPoint && (
                <div
                  className="absolute z-10 rounded-lg border border-border/80 bg-card/95 backdrop-blur-md px-3 py-2 shadow-lg text-xs pointer-events-none flex flex-col gap-0.5 animate-scale-up"
                  style={{
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                    top: `${(hoveredPoint.y / chartHeight) * 100 - 15}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <span className="text-muted-foreground/75 font-semibold">{hoveredPoint.label}</span>
                  <span className="font-bold text-foreground text-orange-500">
                    {chartMetric === "revenue" ? `$${hoveredPoint.value.toFixed(2)}` : `${hoveredPoint.value.toLocaleString()} Plays`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales Log Card */}
          <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-lg">Recent Sales Transactions</h3>
                <p className="text-xs text-muted-foreground">Overview of license purchases for your catalog</p>
              </div>
              <Link
                to="/producer/sales"
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 transition-colors"
              >
                View Ledger <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-border/40">
              {data.recentSales.length > 0 ? (
                data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 hover:bg-secondary/10 px-2 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/80 border border-border flex items-center justify-center font-bold text-foreground text-xs uppercase shadow-sm">
                        {sale.buyerName ? sale.buyerName.slice(0, 2) : (sale.buyerEmail || 'BU').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{sale.buyerName || "Guest User"}</span>
                          <span className="text-[10px] font-semibold text-muted-foreground">({sale.buyerEmail})</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Purchased <span className="text-foreground font-semibold">{sale.beatTitle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 self-stretch sm:self-center">
                      <div className="flex flex-col items-start sm:items-end">
                        <span className={cn(
                          "text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border shadow-sm",
                          sale.licenseType === "Exclusive" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                          sale.licenseType === "Stems Lease" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                          sale.licenseType === "WAV Lease" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        )}>
                          {sale.licenseType}
                        </span>
                        <span className="text-[10px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {sale.time}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-orange-500">+${sale.gross.toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground/75 mt-0.5">Net: ${sale.net.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No sales recorded yet. Keep pushing your beats!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Wallet Payouts & Quick Actions & Top Beats */}
        <div className="space-y-6">
          
          {/* Wallet Balance Widget */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card/70 to-secondary/15 backdrop-blur-md p-6 shadow-md space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-foreground text-md">Earnings Wallet</h3>
              </div>
              <span className="flex h-5 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-500 border border-emerald-500/20">
                Verified Bank
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Available Balance</span>
                <button
                  onClick={toggleBalance}
                  className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                  title={showBalance ? "Hide Balance" : "Show Balance"}
                >
                  {showBalance ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-foreground">
                  {showBalance ? `$${availableBal.toFixed(2)}` : "$ *,***.**"}
                </span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending escrow clearances: {showBalance ? `$${data.stats.pendingBalance.toFixed(2)}` : "$ *,***.**"}
              </p>
            </div>

            {/* Payout threshold progress bar */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground">Payout Threshold (${threshold})</span>
                <span className={cn(
                  "font-bold",
                  thresholdProgress === 100 ? "text-emerald-500" : "text-orange-500"
                )}>
                  {thresholdProgress}% Met
                </span>
              </div>
              <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden border border-border/50">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", thresholdProgress === 100 ? "bg-emerald-500" : "bg-orange-500")}
                  style={{ width: `${thresholdProgress}%` }} 
                />
              </div>
              <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                Min threshold balance required for payouts is $50.
              </p>
            </div>

            {/* Withdrawal Trigger button */}
            <Link to="/producer/payouts" className="w-full">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-orange-500/15 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all">
                Request Manual Payout
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Actions Grid */}
          <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md p-6 shadow-md space-y-4">
            <h3 className="font-bold text-foreground text-md">Creator Toolkit</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/producer/upload" className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-secondary/15 hover:bg-secondary/40 text-center transition-all group">
                <UploadCloud className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground mt-2">Upload Beat</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Add audio stems</span>
              </Link>

              <Link to="/producer/settings" className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-secondary/15 hover:bg-secondary/40 text-center transition-all group">
                <Percent className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground mt-2">Discounts</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Campaigns</span>
              </Link>

              <Link to="/producer/analytics" className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-secondary/15 hover:bg-secondary/40 text-center transition-all group">
                <TrendingUp className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground mt-2">Analytics</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Stats metrics</span>
              </Link>

              <Link to="/producer/settings" className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-secondary/15 hover:bg-secondary/40 text-center transition-all group">
                <FileText className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground mt-2">Licensing</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Contract terms</span>
              </Link>
            </div>
          </div>

          {/* Top Performing Beats Card */}
          <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-md">Top Beats Performance</h3>
              <Link to="/producer/beats" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {data.topBeats.length > 0 ? (
                data.topBeats.slice(0, 3).map((beat) => (
                  <div key={beat.id} className="flex items-center justify-between gap-3 p-1 rounded-lg hover:bg-secondary/20 transition-all">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={beat.cover} 
                        alt={beat.title} 
                        className="h-10 w-10 rounded-lg object-cover border border-border shadow-sm shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{beat.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {beat.bpm} BPM • {beat.key} • <span className="text-orange-500 font-semibold">{beat.genre}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-foreground">${beat.revenue.toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-500 font-bold mt-0.5">{beat.sales} sales</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No beats in catalog yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
