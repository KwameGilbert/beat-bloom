import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Music, Eye, Download } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface BeatData {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  status: "Active" | "Draft" | "Sold";
  basePrice: number;
  exclusivePrice: number;
  plays: number;
  downloads: number;
}

const mockBeats: BeatData[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    genre: "Trap",
    bpm: 140,
    key: "Am",
    status: "Active",
    basePrice: 29.99,
    exclusivePrice: 499.00,
    plays: 481,
    downloads: 12,
  },
  {
    id: "2",
    title: "Urban Legend",
    genre: "Hip Hop",
    bpm: 95,
    key: "Gm",
    status: "Active",
    basePrice: 24.99,
    exclusivePrice: 399.00,
    plays: 89,
    downloads: 3,
  },
  {
    id: "3",
    title: "Neon Horizon",
    genre: "Synthwave",
    bpm: 110,
    key: "Em",
    status: "Draft",
    basePrice: 19.99,
    exclusivePrice: 299.00,
    plays: 0,
    downloads: 0,
  },
  {
    id: "4",
    title: "Sunset Boulevard",
    genre: "R&B",
    bpm: 85,
    key: "F#m",
    status: "Sold",
    basePrice: 35.00,
    exclusivePrice: 599.00,
    plays: 1240,
    downloads: 45,
  }
];

export default function ProducerBeats() {
  const columns: TableColumn<BeatData>[] = [
    {
      key: "title",
      header: "Beat",
      sortable: true,
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded bg-orange-500/10 flex items-center justify-center font-bold text-orange-500 shrink-0">
            <Music className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-semibold text-foreground truncate">{row.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {row.genre} • {row.bpm} BPM • {row.key}
            </p>
          </div>
        </div>
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
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.status === "Active" && "bg-green-500/10 text-green-500",
          row.status === "Draft" && "bg-yellow-500/10 text-yellow-500",
          row.status === "Sold" && "bg-red-500/10 text-red-500"
        )}>
          {row.status}
        </span>
      ),
    },
    {
      key: "basePrice",
      header: "Pricing",
      sortable: true,
      render: (row) => (
        <div className="text-left">
          <p className="text-foreground">${row.basePrice.toFixed(2)} <span className="text-xs text-muted-foreground">(Base)</span></p>
          <p className="text-xs text-muted-foreground">Exclusive: ${row.exclusivePrice.toFixed(2)}</p>
        </div>
      ),
    },
    {
      key: "plays",
      header: "Stats",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {row.plays}</span>
          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {row.downloads}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="Edit beat">
            <Edit2 className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all" aria-label="Delete beat">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" /> Upload Beat
        </Link>
      </div>

      {/* Beats Table using rich core Table features */}
      <Table
        columns={columns}
        data={mockBeats}
        defaultSort={{ key: "title", direction: "asc" }}
      />
    </div>
  );
}
