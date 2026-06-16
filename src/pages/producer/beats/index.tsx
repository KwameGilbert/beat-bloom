import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Music, Eye, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProducerBeats() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            My Beats Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your beat catalog, edit details, and monitor statistics.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Upload Beat
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card/40 backdrop-blur-md rounded-xl border border-border p-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search beats by title, key, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-orange-500 focus:outline-none">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Drafts</option>
            <option value="sold">Sold Exclusive</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-orange-500 focus:outline-none">
            <option value="all">All Genres</option>
            <option value="trap">Trap</option>
            <option value="hip-hop">Hip Hop</option>
            <option value="rnb">R&B</option>
          </select>
        </div>
      </div>

      {/* Beats List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Beat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {/* Row 1 */}
              <tr className="hover:bg-secondary/15 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-orange-500/10 flex items-center justify-center font-bold text-orange-500">
                      <Music className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Midnight Dreams</p>
                      <p className="text-xs text-muted-foreground">Trap • 140 BPM • Am</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground">$29.99 <span className="text-xs text-muted-foreground">(Base)</span></p>
                  <p className="text-xs text-muted-foreground">Exclusive: $499.00</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> 481</span>
                    <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> 12</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="Edit beat">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all" aria-label="Delete beat">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-secondary/15 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-orange-500/10 flex items-center justify-center font-bold text-orange-500">
                      <Music className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Urban Legend</p>
                      <p className="text-xs text-muted-foreground">Hip Hop • 95 BPM • Gm</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground">$24.99 <span className="text-xs text-muted-foreground">(Base)</span></p>
                  <p className="text-xs text-muted-foreground">Exclusive: $399.00</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> 89</span>
                    <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> 3</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="Edit beat">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all" aria-label="Delete beat">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
