import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  TriangleAlert,
  Plus,
  Download,
  Banknote,
  Receipt,
  Wallet,
  PackageSearch,
  X,
  Filter,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { StatusBadge, payTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  activityRows,
  branchName,
  branches,
  currency,
  paymentMixFor,
  productRows,
  ranges,
  seriesFor,
  type RangeKey,
} from "@/lib/mos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trite Merchant OS — Dashboard" },
      {
        name: "description",
        content:
          "Organisation-wide revenue, branch comparison, payment mix and stock alerts for African merchants, settled by Trite.",
      },
      { property: "og:title", content: "Trite Merchant OS — Dashboard" },
      {
        property: "og:description",
        content: "Sell, stock, invoice, reconcile and get paid from one merchant dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const branchColors: Record<string, string> = {
  all: "bg-emerald-600 text-white border-emerald-600",
  osu: "bg-blue-600 text-white border-blue-600",
  "east-legon": "bg-purple-600 text-white border-purple-600",
  kumasi: "bg-amber-600 text-white border-amber-600",
  takoradi: "bg-teal-600 text-white border-teal-600",
};

const rangeColors: Record<string, string> = {
  "7d": "bg-indigo-600 text-white border-indigo-600",
  "30d": "bg-sky-600 text-white border-sky-600",
  "90d": "bg-violet-600 text-white border-violet-600",
  ytd: "bg-fuchsia-600 text-white border-fuchsia-600",
};

const statusColors: Record<string, string> = {
  settled: "bg-emerald-600 text-white border-emerald-600",
  confirmed: "bg-emerald-600 text-white border-emerald-600",
  pending: "bg-amber-500 text-white border-amber-500",
  failed: "bg-red-600 text-white border-red-600",
};

function Chip({
  active,
  onClick,
  children,
  activeClass = "border-[#22c55e] bg-[#22c55e] text-white",
}: {
  active?: boolean | undefined;
  onClick: () => void;
  children: React.ReactNode;
  activeClass?: string | undefined;
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

function Stat({
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

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

const branchMetrics = [
  { key: "revenue", label: "Revenue" },
  { key: "stockValue", label: "Stock value" },
  { key: "staff", label: "Staff" },
] as const;

function Dashboard() {
  const [branchId, setBranchId] = useState("all");
  const [range, setRange] = useState<RangeKey>("7d");
  const [showSales, setShowSales] = useState(true);
  const [showSettled, setShowSettled] = useState(true);
  const [day, setDay] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [stockView, setStockView] = useState<"all" | "critical">("all");
  const [branchMetric, setBranchMetric] =
    useState<(typeof branchMetrics)[number]["key"]>("revenue");

  const series = useMemo(() => seriesFor(branchId, range), [branchId, range]);
  const mix = useMemo(() => paymentMixFor(branchId), [branchId]);

  const totals = useMemo(() => {
    const rows = day ? series.filter((s) => s.day === day) : series;
    const sales = rows.reduce((s, r) => s + r.sales, 0);
    const settled = rows.reduce((s, r) => s + r.settled, 0);
    const txns = Math.max(1, Math.round(sales / 151));
    return { sales, settled, txns, unsettled: sales - settled };
  }, [series, day]);

  const lowStock = useMemo(
    () =>
      productRows
        .filter((p) => p.stock <= p.threshold)
        .filter((p) => branchId === "all" || p.branchId === branchId)
        .filter((p) =>
          stockView === "critical" ? p.stock === 0 || p.stock <= p.threshold / 2 : true,
        ),
    [branchId, stockView],
  );

  const rows = useMemo(
    () =>
      activityRows
        .filter((a) => branchId === "all" || a.branchId === branchId)
        .filter(
          (a) => !method || a.method.toLowerCase().includes(method.toLowerCase().split(" ")[0]!),
        )
        .filter((a) => !status || a.status === status),
    [branchId, method, status],
  );

  const filters = [
    branchId !== "all" && { label: branchName(branchId), clear: () => setBranchId("all") },
    day && { label: `Day · ${day}`, clear: () => setDay(null) },
    method && { label: `Method · ${method}`, clear: () => setMethod(null) },
    status && { label: `Status · ${status}`, clear: () => setStatus(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => {
    setBranchId("all");
    setDay(null);
    setMethod(null);
    setStatus(null);
  };

  const settledPct = Math.round((totals.settled / Math.max(1, totals.sales)) * 100);

  return (
    <AppShell
      title="Organisation dashboard"
      subtitle={`Sarpong Retail Ltd · ${branchName(branchId)} · ${ranges.find((r) => r.key === range)?.label}`}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="size-4" /> Export
          </Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/85">
            <Plus className="size-4" /> New sale
          </Button>
        </>
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
          <div className="flex flex-wrap gap-1.5">
            {ranges.map((r) => (
              <Chip
                key={r.key}
                active={range === r.key}
                onClick={() => {
                  setRange(r.key);
                  setDay(null);
                }}
                activeClass={rangeColors[r.key]}
              >
                {r.label}
              </Chip>
            ))}
          </div>
          {filters.length > 0 && (
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              {filters.map((f) => (
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Gross sales"
            value={currency(totals.sales)}
            delta={12.4}
            sub={day ? `on ${day}` : "vs previous period"}
            icon={Banknote}
          />
          <Stat
            label="Settled by Trite"
            value={currency(totals.settled)}
            delta={9.8}
            sub={`${settledPct}% of gross`}
            icon={Wallet}
          />
          <Stat
            label="Transactions"
            value={totals.txns.toLocaleString()}
            delta={5.2}
            sub="avg GHS 151"
            icon={Receipt}
          />
          <Stat
            label="Stock at risk"
            value={`${lowStock.length} SKUs`}
            sub="below threshold"
            icon={PackageSearch}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Sales vs settlement</h2>
                <p className="text-xs text-muted-foreground">
                  Click a point to drill into a single day · {branchName(branchId)}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Chip
                  active={showSales}
                  onClick={() => setShowSales((v) => !v)}
                  activeClass="bg-emerald-600 text-white border-emerald-600"
                >
                  Sold
                </Chip>
                <Chip
                  active={showSettled}
                  onClick={() => setShowSettled((v) => !v)}
                  activeClass="bg-blue-600 text-white border-blue-600"
                >
                  Settled
                </Chip>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={series}
                  margin={{ left: -18, right: 4, top: 4 }}
                  onClick={(e) => {
                    const d = (e?.activeLabel as string) ?? null;
                    setDay((prev) => (prev === d ? null : d));
                  }}
                >
                  <defs>
                    <linearGradient id="g-sales" x1="0" y1="0" x2="0" y2="1">
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
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => currency(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {showSales && (
                    <Area
                      name="Sold"
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--color-accent)"
                      strokeWidth={2}
                      fill="url(#g-sales)"
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {showSettled && (
                    <Area
                      name="Settled"
                      type="monotone"
                      dataKey="settled"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      fill="transparent"
                      strokeDasharray="4 3"
                      activeDot={{ r: 5 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {day && (
              <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-xs">
                <span className="font-medium">{day}</span> · sold {currency(totals.sales)} · settled{" "}
                {currency(totals.settled)} · outstanding {currency(totals.unsettled)}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Payment method mix</h2>
            <p className="text-xs text-muted-foreground">Click a method to filter activity</p>
            <ul className="mt-4 space-y-3">
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
                        <span className="num text-xs text-muted-foreground">
                          {currency(m.amount)} · {m.value}%
                        </span>
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

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Branch comparison</h2>
                <p className="text-xs text-muted-foreground">Click a bar to scope the dashboard</p>
              </div>
              <div className="flex gap-1.5">
                {branchMetrics.map((m) => (
                  <Chip
                    key={m.key}
                    active={branchMetric === m.key}
                    onClick={() => setBranchMetric(m.key)}
                  >
                    {m.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={branches.slice(1)}
                  margin={{ left: -18, right: 4 }}
                  onClick={(e) => {
                    const name = e?.activeLabel as string | undefined;
                    const b = branches.find((x) => x.name === name);
                    if (b) setBranchId((prev) => (prev === b.id ? "all" : b.id));
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      branchMetric === "staff" ? `${v}` : `${Math.round(v / 1000)}k`
                    }
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-secondary)" }}
                    contentStyle={tooltipStyle}
                    formatter={(v: number) =>
                      branchMetric === "staff" ? `${v} people` : currency(v)
                    }
                  />
                  <Bar dataKey={branchMetric} radius={[4, 4, 0, 0]} className="cursor-pointer">
                    {branches.slice(1).map((b) => (
                      <Cell
                        key={b.id}
                        fill={
                          branchId === "all" || branchId === b.id
                            ? "var(--color-accent)"
                            : "var(--color-border)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border p-4">
              <TriangleAlert className="size-4 text-warning" />
              <h2 className="text-sm font-semibold">Low stock alerts</h2>
              <span className="num ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs">
                {lowStock.length}
              </span>
            </div>
            <div className="flex gap-1.5 border-b border-border p-3">
              <Chip
                active={stockView === "all"}
                onClick={() => setStockView("all")}
                activeClass="bg-amber-600 text-white border-amber-600"
              >
                Below threshold
              </Chip>
              <Chip
                active={stockView === "critical"}
                onClick={() => setStockView("critical")}
                activeClass="bg-red-600 text-white border-red-600"
              >
                Critical only
              </Chip>
            </div>
            <ul className="divide-y divide-border">
              {lowStock.map((p) => (
                <li key={p.sku} className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <button
                      onClick={() => setBranchId(p.branchId)}
                      className="truncate text-xs text-muted-foreground underline-offset-2 hover:underline"
                    >
                      {p.sku} · {p.branch}
                    </button>
                  </div>
                  <StatusBadge tone={p.stock === 0 ? "bad" : "warn"}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </StatusBadge>
                </li>
              ))}
              {lowStock.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">
                  Nothing below threshold for this filter.
                </li>
              )}
            </ul>
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full">
                Send restock links
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground">
                {rows.length} of {activityRows.length} events · click a status to filter
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
              <Button variant="ghost" size="sm">
                View audit trail
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 py-2.5 font-medium">Reference</th>
                  <th className="px-4 py-2.5 font-medium">Event</th>
                  <th className="px-4 py-2.5 font-medium">Who</th>
                  <th className="px-4 py-2.5 font-medium">Branch</th>
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-secondary/60">
                    <td className="num px-4 py-3 font-medium">{a.id}</td>
                    <td className="px-4 py-3">{a.what}</td>
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
                    <td className="num px-4 py-3 text-right font-medium">{currency(a.amount)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setStatus(status === a.status ? null : a.status)}>
                        <StatusBadge tone={payTone[a.status] ?? "neutral"}>{a.status}</StatusBadge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{a.when}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No events match these filters.
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
