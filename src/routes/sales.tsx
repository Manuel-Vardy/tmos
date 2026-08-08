import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ShoppingCart,
  TrendingUp,
  Banknote,
  RotateCcw,
  Filter,
  X,
  CalendarDays,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

import { AppShell } from "@/components/app-shell";
import { StatusBadge, payTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  activityRows,
  branchName,
  branches,
  currency,
  paymentMixFor,
  seriesFor,
} from "@/lib/mos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { title: "Trite Merchant OS — Sales" },
      {
        name: "description",
        content:
          "View all sales transactions across branches, filtered by date range, payment method, and status.",
      },
      { property: "og:title", content: "Trite Merchant OS — Sales" },
    ],
  }),
  component: SalesPage,
});

function Chip({
  active,
  onClick,
  children,
  activeClass = "border-[#22c55e] bg-[#22c55e] text-white",
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors shadow-xs",
        active ? activeClass : "border-border hover:bg-secondary text-foreground",
      )}
    >
      {children}
    </button>
  );
}

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

const branchColors: Record<string, string> = {
  all: "bg-emerald-600 text-white border-emerald-600",
  osu: "bg-blue-600 text-white border-blue-600",
  "east-legon": "bg-purple-600 text-white border-purple-600",
  kumasi: "bg-amber-600 text-white border-amber-600",
  takoradi: "bg-teal-600 text-white border-teal-600",
};

function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  const label = value?.from
    ? value.to
      ? `${format(value.from, "dd MMM yyyy")} – ${format(value.to, "dd MMM yyyy")}`
      : format(value.from, "dd MMM yyyy")
    : "Pick a date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id="date-range-picker"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors shadow-xs",
            value?.from
              ? "border-[#22c55e] bg-[#22c55e] text-white"
              : "border-border hover:bg-secondary text-foreground",
          )}
        >
          <CalendarDays className="size-3.5" />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          disabled={{ after: new Date() }}
          initialFocus
        />
        {value?.from && (
          <div className="border-t border-border p-3 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="ml-2 bg-accent text-accent-foreground hover:bg-accent/85"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

const statusColors: Record<string, string> = {
  settled: "bg-emerald-600 text-white border-emerald-600",
  confirmed: "bg-emerald-600 text-white border-emerald-600",
  pending: "bg-amber-500 text-white border-amber-500",
  failed: "bg-red-600 text-white border-red-600",
};

function StatCard({
  label,
  value,
  delta,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  sub: string;
  icon: React.ElementType;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="num mt-3 text-2xl font-bold">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={`num inline-flex items-center gap-0.5 font-medium ${up ? "text-foreground" : "text-destructive"}`}
          >
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
        <span className="text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}

function SalesPage() {
  const [branchId, setBranchId] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [method, setMethod] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Use 30d series for chart (mock data; real app would filter by dateRange)
  const series = useMemo(() => seriesFor(branchId, "30d"), [branchId]);
  const mix = useMemo(() => paymentMixFor(branchId), [branchId]);

  const saleRows = useMemo(
    () =>
      activityRows
        .filter((a) => branchId === "all" || a.branchId === branchId)
        .filter(
          (a) =>
            !method || a.method.toLowerCase().includes(method.toLowerCase().split(" ")[0]!),
        )
        .filter((a) => !status || a.status === status),
    [branchId, method, status],
  );

  const totals = useMemo(() => {
    const sales = series.reduce((s, r) => s + r.sales, 0);
    const settled = series.reduce((s, r) => s + r.settled, 0);
    const txns = Math.max(1, Math.round(sales / 151));
    const refunds = saleRows
      .filter((r) => r.amount < 0)
      .reduce((s, r) => s + Math.abs(r.amount), 0);
    return { sales, settled, txns, refunds };
  }, [series, saleRows]);

  const activeFilters = [
    branchId !== "all" && { label: branchName(branchId), clear: () => setBranchId("all") },
    method && { label: `Method · ${method}`, clear: () => setMethod(null) },
    status && { label: `Status · ${status}`, clear: () => setStatus(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => {
    setBranchId("all");
    setDateRange(undefined);
    setMethod(null);
    setStatus(null);
  };

  const rangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "dd MMM")} – ${format(dateRange.to, "dd MMM yyyy")}`
      : format(dateRange.from, "dd MMM yyyy")
    : "Last 30 days";

  return (
    <AppShell
      title="Sales"
      subtitle={`${branchName(branchId)} · ${rangeLabel}`}
      actions={
        <Button variant="outline" size="sm">
          <Download className="size-4" /> Export
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <section className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
          <Filter className="size-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {branches.map((b) => (
              <Chip
                key={b.id}
                active={branchId === b.id}
                onClick={() => setBranchId(b.id)}
                activeClass={branchColors[b.id]}
              >
                {b.id === "all" ? "All branches" : b.name}
              </Chip>
            ))}
          </div>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          {activeFilters.length > 0 && (
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              {activeFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={f.clear}
                  className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent/20 px-2.5 py-1 text-xs font-medium"
                >
                  {f.label}
                  <X className="size-3" />
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </section>

        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Gross sales"
            value={currency(totals.sales)}
            delta={12.4}
            sub="vs previous period"
            icon={Banknote}
          />
          <StatCard
            label="Transactions"
            value={totals.txns.toLocaleString()}
            delta={5.2}
            sub="avg GHS 151"
            icon={ShoppingCart}
          />
          <StatCard
            label="Settled"
            value={currency(totals.settled)}
            delta={9.8}
            sub={`${Math.round((totals.settled / Math.max(1, totals.sales)) * 100)}% of gross`}
            icon={TrendingUp}
          />
          <StatCard
            label="Refunds issued"
            value={currency(totals.refunds)}
            sub="this period"
            icon={RotateCcw}
          />
        </section>

        {/* Sales trend chart + Payment methods side by side */}
        <section className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 xl:col-span-3">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Sales trend</h2>
              <p className="text-xs text-muted-foreground">
                Daily gross sales for {branchName(branchId)} over the selected period
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: -18, right: 4, top: 4 }}>
                  <defs>
                    <linearGradient id="g-sales-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => currency(v)}
                  />
                  <Area
                    name="Sales"
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    fill="url(#g-sales-trend)"
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment methods */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold">Payment methods</h2>
            <p className="text-xs text-muted-foreground mb-4">Click to filter transactions</p>
            <ul className="space-y-3">
              {mix.map((m) => {
                const active = method === m.method;
                return (
                  <li key={m.method}>
                    <button
                      onClick={() => setMethod(active ? null : m.method)}
                      aria-pressed={active}
                      className="w-full rounded-md p-1 text-left transition-colors hover:bg-secondary/70"
                    >
                      <div className="mb-1 flex items-baseline justify-between text-sm">
                        <span className={cn(active && "font-semibold")}>{m.method}</span>
                        <span className="num text-xs text-muted-foreground">{m.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            active ? "bg-foreground" : "bg-accent",
                          )}
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Transactions table — full width */}
        <section className="rounded-lg border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 className="text-base font-semibold">Transactions</h2>
              <p className="text-xs text-muted-foreground">
                {saleRows.length} records · click a status to filter
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["settled", "confirmed", "pending", "failed"].map((s) => (
                <Chip
                  key={s}
                  active={status === s}
                  onClick={() => setStatus(status === s ? null : s)}
                  activeClass={statusColors[s]}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 py-2.5 font-medium">Reference</th>
                  <th className="px-4 py-2.5 font-semibold">Event</th>
                  <th className="px-4 py-2.5 font-medium">Cashier</th>
                  <th className="px-4 py-2.5 font-medium">Branch</th>
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {saleRows.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-secondary/60">
                    <td className="num px-4 py-3 font-medium">{a.id}</td>
                    <td className="px-4 py-3 font-medium">{a.what}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.who}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setBranchId(a.branchId)}
                        className="text-muted-foreground underline-offset-2 hover:underline"
                      >
                        {a.where}
                      </button>
                    </td>
                    <td className="px-4 py-3">{a.method}</td>
                    <td
                      className={cn(
                        "num px-4 py-3 text-right font-medium",
                        a.amount < 0 && "text-destructive",
                      )}
                    >
                      {currency(a.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setStatus(status === a.status ? null : a.status)}
                      >
                        <StatusBadge tone={payTone[a.status] ?? "neutral"}>
                          {a.status}
                        </StatusBadge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{a.when}</td>
                  </tr>
                ))}
                {saleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                    >
                      No transactions match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
