import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import type { DateRange } from "react-day-picker";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import { WHOLESALE_ORDERS, type WholesaleOrder } from "@/lib/wholesale-data";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Wholesale order management — view, track and fulfil bulk customer orders across all branches.",
      },
      { property: "og:title", content: "Orders — Trite Merchant OS" },
    ],
  }),
  component: Orders,
});

type OrderStatus = WholesaleOrder["status"];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; activePill: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400 font-semibold",
    bg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60",
    activePill: "bg-amber-500 text-white",
  },
  processing: {
    label: "Processing",
    icon: ClipboardList,
    color: "text-blue-600 dark:text-blue-400 font-semibold",
    bg: "bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60",
    activePill: "bg-blue-600 text-white",
  },
  dispatched: {
    label: "Dispatched",
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400 font-semibold",
    bg: "bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/60",
    activePill: "bg-purple-600 text-white",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400 font-semibold",
    bg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60",
    activePill: "bg-emerald-600 text-white",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-rose-600 dark:text-rose-400 font-semibold",
    bg: "bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800/60",
    activePill: "bg-rose-600 text-white",
  },
};

const STAT_STATUSES: OrderStatus[] = ["pending", "processing", "dispatched", "delivered"];

function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filtered = WHOLESALE_ORDERS.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppShell
      title="Orders"
      subtitle={`${WHOLESALE_ORDERS.length} wholesale orders · ${WHOLESALE_ORDERS.filter((o) => o.status === "pending").length} pending`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> New Order
        </Button>
      }
    >
      {/* Stat cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_STATUSES.map((s) => {
          const count = WHOLESALE_ORDERS.filter((o) => o.status === s).length;
          const total = WHOLESALE_ORDERS.filter((o) => o.status === s).reduce((acc, o) => acc + o.total, 0);
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <div key={s} className="rounded-xl border border-border bg-card p-4 transition-all">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{cfg.label}</p>
                <span className={`rounded-full p-2 ${cfg.bg}`}>
                  <Icon className={`size-4 ${cfg.color}`} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{count}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{currency(total)}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-secondary text-muted-foreground hover:bg-border"
            }`}
          >
            All
          </button>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isSelected = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  isSelected
                    ? cfg.activePill
                    : "bg-secondary text-muted-foreground hover:bg-border"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="hidden px-4 py-3 sm:table-cell">Branch</th>
              <th className="hidden px-4 py-3 md:table-cell">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 lg:table-cell">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No orders match your search.
                </td>
              </tr>
            )}
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const Icon = cfg.icon;
              return (
                <tr key={order.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{order.id}</td>
                  <td className="px-4 py-3 font-medium">{order.customerName}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{order.branch}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{order.items} items</td>
                  <td className="px-4 py-3 font-semibold">{currency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>
                      <Icon className="size-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{order.date}</td>
                  <td className="px-4 py-3">
                    <button className="grid size-7 place-items-center rounded-md border border-border bg-background transition-colors hover:bg-secondary">
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
