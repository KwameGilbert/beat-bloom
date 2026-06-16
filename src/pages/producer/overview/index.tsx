import { Link } from "react-router-dom";
import { Music, DollarSign, Play, ArrowRight, TrendingUp, Users } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";

export default function ProducerOverview() {
  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Producer Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here is an overview of your music business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$1,248.50"
          description="+12.5% from last month"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: "12.5%", isPositive: true }}
        />
        <StatsCard
          title="Total Beats sold"
          value="42"
          description="+4 this week"
          icon={<Music className="h-4 w-4" />}
          trend={{ value: "8%", isPositive: true }}
        />
        <StatsCard
          title="Total Plays"
          value="15.8K"
          description="Across all uploads"
          icon={<Play className="h-4 w-4" />}
          trend={{ value: "24.3%", isPositive: true }}
        />
        <StatsCard
          title="Active Listeners"
          value="3.2K"
          description="Unique users this month"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Main sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Beats Card */}
        <div className="md:col-span-1 lg:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground text-lg">My Recent Beats</h2>
              <Link
                to="/producer/beats"
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                Manage Catalog <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {/* Beat placeholder 1 */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-secondary/50 flex items-center justify-center font-bold text-orange-500 text-xs">
                    MD
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Midnight Dreams</p>
                    <p className="text-xs text-muted-foreground">140 BPM • Am</p>
                  </div>
                </div>
                <span className="text-xs rounded-full bg-green-500/10 text-green-500 px-2.5 py-0.5 font-medium">
                  Active
                </span>
              </div>
              {/* Beat placeholder 2 */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-secondary/50 flex items-center justify-center font-bold text-orange-500 text-xs">
                    UL
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Urban Legend</p>
                    <p className="text-xs text-muted-foreground">95 BPM • Gm</p>
                  </div>
                </div>
                <span className="text-xs rounded-full bg-green-500/10 text-green-500 px-2.5 py-0.5 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/upload"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            Upload New Beat
          </Link>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-foreground text-lg">Recent Sales</h2>
            <div className="space-y-4">
              {/* Activity item 1 */}
              <div className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Sold MP3 Lease</p>
                  <p className="text-xs text-muted-foreground">Midnight Dreams</p>
                </div>
                <span className="font-bold text-orange-500">+$24.99</span>
              </div>
              {/* Activity item 2 */}
              <div className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Sold WAV Lease</p>
                  <p className="text-xs text-muted-foreground">Chill Vibes</p>
                </div>
                <span className="font-bold text-orange-500">+$49.99</span>
              </div>
            </div>
          </div>
          <Link
            to="/producer/sales"
            className="mt-6 text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            View all sales <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
