import { FileText } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";

interface SaleData {
  id: string;
  orderNumber: string;
  date: string;
  beatTitle: string;
  buyerEmail: string;
  licenseType: "MP3 Lease" | "WAV Lease" | "Unlimited Stems" | "Exclusive";
  gross: number;
  net: number;
}

const mockSales: SaleData[] = [
  {
    id: "1",
    orderNumber: "BB-178146-218",
    date: "Jun 14, 2026",
    beatTitle: "Midnight Dreams",
    buyerEmail: "buyer@example.com",
    licenseType: "MP3 Lease",
    gross: 24.99,
    net: 21.24,
  },
  {
    id: "2",
    orderNumber: "BB-178119-943",
    date: "Jun 12, 2026",
    beatTitle: "Chill Vibes",
    buyerEmail: "artist@beatbloom.com",
    licenseType: "WAV Lease",
    gross: 49.99,
    net: 42.49,
  },
  {
    id: "3",
    orderNumber: "BB-178101-512",
    date: "Jun 10, 2026",
    beatTitle: "Sunset Boulevard",
    buyerEmail: "producerx@gmail.com",
    licenseType: "Unlimited Stems",
    gross: 99.99,
    net: 84.99,
  },
  {
    id: "4",
    orderNumber: "BB-178055-110",
    date: "Jun 05, 2026",
    beatTitle: "Urban Legend",
    buyerEmail: "hacker@beatbloom.com",
    licenseType: "Exclusive",
    gross: 499.00,
    net: 424.15,
  }
];

export default function ProducerSales() {
  const columns: TableColumn<SaleData>[] = [
    {
      key: "beatTitle",
      header: "Order Info",
      sortable: true,
      searchable: true,
      render: (row) => (
        <div className="text-left">
          <p className="font-semibold text-foreground">{row.beatTitle}</p>
          <p className="text-xs text-muted-foreground">Order #{row.orderNumber} • {row.date}</p>
        </div>
      ),
    },
    {
      key: "buyerEmail",
      header: "Buyer",
      sortable: true,
      searchable: true,
      render: (row) => (
        <p className="text-foreground text-left">{row.buyerEmail}</p>
      ),
    },
    {
      key: "licenseType",
      header: "License Type",
      sortable: true,
      filterable: true,
      filterType: "select",
      render: (row) => (
        <span className="inline-flex items-center rounded bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-500">
          {row.licenseType}
        </span>
      ),
    },
    {
      key: "net",
      header: "Net Revenue",
      sortable: true,
      render: (row) => (
        <p className="font-bold text-foreground text-left">
          ${row.net.toFixed(2)}{" "}
          <span className="text-xs font-normal text-muted-foreground">(${row.gross.toFixed(2)} Gross)</span>
        </p>
      ),
    },
    {
      key: "invoice",
      header: "Invoice",
      sortable: false,
      className: "text-right",
      render: () => (
        <div className="flex justify-end">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="View invoice">
            <FileText className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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

      {/* Flexible Table */}
      <Table
        columns={columns}
        data={mockSales}
        defaultSort={{ key: "beatTitle", direction: "asc" }}
      />
    </div>
  );
}
