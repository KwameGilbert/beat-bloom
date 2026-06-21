import { useState, useEffect, useMemo } from "react";
import { FileText, DollarSign, Wallet, FileCheck2, Loader2 } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { StatsCard } from "@/components/ui/stats-card";
import producerService from "@/lib/producer";

interface SaleData {
  id: string;
  orderNumber: string;
  date: string;
  beatTitle: string;
  buyerEmail: string;
  licenseType: string;
  gross: number;
  net: number;
}

export default function ProducerSales() {
  const [sales, setSales] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await producerService.getSalesList();
        if (response.success && response.data) {
          const mapped = response.data.map((s: any) => ({
            id: String(s.id),
            orderNumber: s.orderNumber,
            date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            beatTitle: s.beatTitle,
            buyerEmail: s.buyerEmail,
            licenseType: s.licenseType,
            gross: s.gross,
            net: s.net
          }));
          setSales(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch sales list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalGross = useMemo(() => sales.reduce((sum, s) => sum + s.gross, 0), [sales]);
  const totalNet = useMemo(() => sales.reduce((sum, s) => sum + s.net, 0), [sales]);
  const totalSalesCount = sales.length;

  const columns: TableColumn<SaleData>[] = [
    {
      key: "beatTitle",
      header: "Order Info",
      sortable: true,
      searchable: true,
      render: (row) => (
        <div className="text-left">
          <p className="font-semibold text-foreground">{row.beatTitle}</p>
          <p className="text-xs text-muted-foreground">
            Order #{row.orderNumber} • {row.date}
          </p>
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
          <span className="text-xs font-normal text-muted-foreground">
            (${row.gross.toFixed(2)} Gross)
          </span>
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
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            aria-label="View invoice"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-black text-foreground sm:text-3xl tracking-tight">
          Sales & Earnings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your sales history, monitor license orders, and view earnings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Gross Earnings"
          value={`$${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-4 w-4" />}
          variant="compact"
        />
        <StatsCard
          title="Net Earnings"
          value={`$${totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Wallet className="h-4 w-4" />}
          variant="compact"
        />
        <StatsCard
          title="Active Orders"
          value={String(totalSalesCount)}
          icon={<FileCheck2 className="h-4 w-4" />}
          variant="compact"
        />
      </div>

      {/* Flexible Table */}
      <Table
        columns={columns}
        data={sales}
        defaultSort={{ key: "beatTitle", direction: "asc" }}
      />
    </div>
  );
}
