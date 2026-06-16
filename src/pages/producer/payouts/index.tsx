import { useState } from "react";
import { Wallet, CreditCard, ArrowUpRight, CheckCircle2, Clock, X } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PayoutData {
  id: string;
  transactionId: string;
  method: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

const mockPayouts: PayoutData[] = [
  {
    id: "1",
    transactionId: "TXN-90281-2981",
    method: "MTN Mobile Money",
    date: "Jun 05, 2026",
    amount: 450.00,
    status: "Completed",
  },
  {
    id: "2",
    transactionId: "TXN-82193-4122",
    method: "MTN Mobile Money",
    date: "May 20, 2026",
    amount: 350.00,
    status: "Completed",
  },
  {
    id: "3",
    transactionId: "TXN-71120-1193",
    method: "Bank Transfer",
    date: "May 02, 2026",
    amount: 210.00,
    status: "Completed",
  },
  {
    id: "4",
    transactionId: "TXN-61198-4451",
    method: "PayPal",
    date: "Apr 15, 2026",
    amount: 125.00,
    status: "Failed",
  }
];

export default function ProducerPayouts() {
  const [isRequesting, setIsRequesting] = useState(false);

  const columns: TableColumn<PayoutData>[] = [
    {
      key: "transactionId",
      header: "Transaction ID",
      sortable: true,
      searchable: true,
      className: "font-mono text-xs text-left",
    },
    {
      key: "method",
      header: "Method",
      sortable: true,
      filterable: true,
      filterType: "select",
      className: "text-left",
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      className: "text-muted-foreground text-left",
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-foreground text-left">
          ${row.amount.toFixed(2)}
        </span>
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
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.status === "Completed" && "bg-green-500/10 text-green-500",
          row.status === "Pending" && "bg-yellow-500/10 text-yellow-500",
          row.status === "Failed" && "bg-red-500/10 text-red-500"
        )}>
          {row.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
          {row.status === "Pending" && <Clock className="h-3 w-3" />}
          {row.status === "Failed" && <X className="h-3 w-3" />}
          {row.status}
        </span>
      ),
    },
  ];

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
          <Button
            onClick={() => setIsRequesting(true)}
            className="px-6 py-3 flex items-center gap-2 h-auto text-sm animate-scale-click"
          >
            Request Payout <ArrowUpRight className="h-4 w-4" />
          </Button>
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
        <Table
          columns={columns}
          data={mockPayouts}
          defaultSort={{ key: "date", direction: "desc" }}
        />
      </div>
    </div>
  );
}
