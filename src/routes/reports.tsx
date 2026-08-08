import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { branches, currency, paymentMix, revenueSeries } from "@/lib/mos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Configurable date-range reporting on sales, stock movement, payment mix, settlement and reconciliation, exportable to CSV or PDF.",
      },
      { property: "og:title", content: "Reports — Trite Merchant OS" },
      {
        property: "og:description",
        content: "Sold vs paid vs settled, consolidated across every branch without spreadsheets.",
      },
    ],
  }),
  component: Reports,
});

const ranges = ["Today", "7 days", "30 days", "Quarter", "Custom"];

function Reports() {
  const [range, setRange] = useState("7 days");

  return (
    <AppShell
      title="Reports & analytics"
      subtitle="Sales, stock, payments and settlement — export-ready"
      actions={
        <>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="size-4" /> CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="size-4" /> PDF
          </Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/85">
            <Download className="size-4" /> Accounting handoff
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {ranges.map((r, i) => {
            const colors = [
              "border-indigo-600 bg-indigo-600 text-white",
              "border-sky-600 bg-sky-600 text-white",
              "border-violet-600 bg-violet-600 text-white",
              "border-fuchsia-600 bg-fuchsia-600 text-white",
            ];
            const activeColor = colors[i % colors.length];
            return (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors shadow-xs",
                  range === r ? activeColor : "border-border hover:bg-secondary text-foreground",
                )}
              >
                {r}
              </button>
            );
          })}
        </div>

        <section className="grid gap-4 sm:grid-cols-4">
          {[
            ["Sold", currency(482_310)],
            ["Paid", currency(469_880)],
            ["Settled", currency(448_200)],
            ["Unreconciled", currency(21_680)],
          ].map(([l, v], i) => (
            <div key={l} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">{l}</p>
              <p className="num mt-2 text-xl font-bold">{v}</p>
              <StatusBadge tone={i === 3 ? "warn" : "good"} className="mt-2">
                {i === 3 ? "Needs review" : "Reconciled"}
              </StatusBadge>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Settlement trend</h2>
            <p className="mb-4 text-xs text-muted-foreground">Sold against settled, {range}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries} margin={{ left: -18, right: 4, top: 4 }}>
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
                    tickFormatter={(v) => `${v / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => currency(v)}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="settled"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Stock turnover by branch</h2>
            <p className="mb-4 text-xs text-muted-foreground">Value of stock held, {range}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branches.slice(1)} margin={{ left: -18, right: 4 }}>
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
                    tickFormatter={(v) => `${v / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-secondary)" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => currency(v)}
                  />
                  <Bar dataKey="stockValue" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">Revenue by payment method</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 text-right font-medium">Volume</th>
                  <th className="px-4 py-2.5 text-right font-medium">Share</th>
                  <th className="px-4 py-2.5 text-right font-medium">Fees</th>
                  <th className="px-4 py-2.5 font-medium">Settlement window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paymentMix.map((m, i) => (
                  <tr key={m.method} className="transition-colors hover:bg-secondary/60">
                    <td className="px-4 py-3 font-medium">{m.method}</td>
                    <td className="num px-4 py-3 text-right">{currency(m.amount)}</td>
                    <td className="num px-4 py-3 text-right">{m.value}%</td>
                    <td className="num px-4 py-3 text-right text-muted-foreground">
                      {currency(m.amount * 0.014)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {i === 3 ? "Instant" : i === 4 ? "Till close" : "T+1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
