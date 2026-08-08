import { createFileRoute } from "@tanstack/react-router";
import { Plus, Repeat, Send, Download } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge, payTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { currency, invoices } from "@/lib/mos-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Invoicing — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Build, send and track invoices with embedded Trite payment links, recurring schedules and VAT-ready line items.",
      },
      { property: "og:title", content: "Invoicing — Trite Merchant OS" },
      {
        property: "og:description",
        content: "Draft to paid, reconciled automatically against every Trite payment.",
      },
    ],
  }),
  component: Invoices,
});

const stages = ["draft", "sent", "viewed", "paid", "overdue"] as const;

function Invoices() {
  const totalOutstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "draft")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <AppShell
      title="Invoicing & receipts"
      subtitle={`${invoices.length} invoices this cycle · ${currency(totalOutstanding)} outstanding`}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="size-4" /> Export
          </Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/85">
            <Plus className="size-4" /> New invoice
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <section className="grid gap-3 sm:grid-cols-5">
          {stages.map((s) => {
            const set = invoices.filter((i) => i.status === s);
            return (
              <div key={s} className="rounded-lg border border-border bg-card p-4">
                <StatusBadge tone={payTone[s] ?? "neutral"}>{s}</StatusBadge>
                <p className="num mt-3 text-xl font-bold">{set.length}</p>
                <p className="num text-xs text-muted-foreground">
                  {currency(set.reduce((a, b) => a + b.amount, 0))}
                </p>
              </div>
            );
          })}
        </section>

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <section className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold">All invoices</h2>
              <p className="text-xs text-muted-foreground">
                Status updates arrive from the Trite payment engine
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-2.5 font-medium">Invoice</th>
                    <th className="px-4 py-2.5 font-medium">Customer</th>
                    <th className="px-4 py-2.5 font-medium">Issued</th>
                    <th className="px-4 py-2.5 font-medium">Due</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((i) => (
                    <tr key={i.id} className="transition-colors hover:bg-secondary/60">
                      <td className="num px-4 py-3 font-medium">
                        <span className="inline-flex items-center gap-2">
                          {i.id}
                          {i.recurring && <Repeat className="size-3.5 text-muted-foreground" />}
                        </span>
                      </td>
                      <td className="px-4 py-3">{i.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{i.issued}</td>
                      <td className="px-4 py-3 text-muted-foreground">{i.due}</td>
                      <td className="num px-4 py-3 text-right font-semibold">
                        {currency(i.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={payTone[i.status] ?? "neutral"}>{i.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          <Send className="size-3.5" /> Remind
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Quick invoice</h2>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Customer</label>
                  <input
                    placeholder="Search or add customer"
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Amount</label>
                    <input
                      placeholder="GHS 0.00"
                      className="num mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Due in</label>
                    <select className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-ring">
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  Apply VAT 15% + NHIL/GETFund 6%
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" className="accent-accent" />
                  Make recurring monthly
                </label>
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/85"
                  size="sm"
                >
                  Create & send payment link
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Receipt delivery</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Default channels for auto-generated receipts.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["SMS", true],
                  ["WhatsApp", true],
                  ["Email", true],
                  ["Thermal printer", false],
                ].map(([c, on]) => (
                  <li key={c as string} className="flex items-center justify-between">
                    <span>{c as string}</span>
                    <StatusBadge tone={on ? "good" : "neutral"}>{on ? "On" : "Off"}</StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
