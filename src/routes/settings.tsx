import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Wallet, Bell, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { branches, roles } from "@/lib/mos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Roles and permissions, settlement destinations per branch, payment preferences and notification controls.",
      },
      { property: "og:title", content: "Settings — Trite Merchant OS" },
      {
        property: "og:description",
        content: "Role-based access enforced at the API layer, not just hidden in the UI.",
      },
    ],
  }),
  component: Settings,
});

const tabs = [
  { id: "roles", label: "Roles & permissions", icon: Users },
  { id: "settlement", label: "Settlement", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

function Settings() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("roles");

  return (
    <AppShell title="Settings" subtitle="Sarpong Retail Ltd · organisation account">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm whitespace-nowrap transition-colors",
                tab === t.id
                  ? "bg-accent text-accent-foreground font-medium shadow-xs"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <section className="space-y-4">
          {tab === "roles" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-sm font-semibold">Roles & permissions</h2>
                  <p className="text-xs text-muted-foreground">
                    Enforced server-side on every write action
                  </p>
                </div>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/85">
                  Invite staff
                </Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="px-4 py-2.5 font-medium">People</th>
                    <th className="px-4 py-2.5 font-medium">Scope</th>
                    <th className="px-4 py-2.5 font-medium">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {roles.map((r) => (
                    <tr key={r.role} className="transition-colors hover:bg-secondary/60">
                      <td className="px-4 py-3 font-medium">{r.role}</td>
                      <td className="num px-4 py-3">{r.people}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.scope}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.perms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "settlement" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <ShieldCheck className="size-4" />
                <p className="text-muted-foreground">
                  Destinations map to Trite's per-merchant settlement configuration — fiat or
                  stablecoin, instant or scheduled.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h2 className="text-sm font-semibold">Branch settlement destinations</h2>
                </div>
                <ul className="divide-y divide-border">
                  {branches.slice(1).map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-3 p-4">
                      <div className="min-w-40 flex-1">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.settlement}</p>
                      </div>
                      <select className="h-9 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-ring">
                        <option>Instant</option>
                        <option>Daily · 18:00</option>
                        <option>Weekly</option>
                      </select>
                      <StatusBadge tone="good">Active</StatusBadge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <h2 className="text-sm font-semibold">Notification centre</h2>
                <p className="text-xs text-muted-foreground">Who gets told, and how</p>
              </div>
              <ul className="divide-y divide-border">
                {[
                  ["Low stock threshold reached", "Owner, Branch manager", true],
                  ["Invoice overdue", "Owner, Accountant", true],
                  ["Refund above GHS 500", "Owner", true],
                  ["New branch created", "Owner", true],
                  ["Delivery delayed", "Delivery coordinator", false],
                  ["Till variance at close", "Branch manager", true],
                ].map(([label, who, on]) => (
                  <li key={label as string} className="flex items-center gap-3 p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{label as string}</p>
                      <p className="text-xs text-muted-foreground">{who as string}</p>
                    </div>
                    <StatusBadge tone={on ? "good" : "neutral"}>
                      {on ? "Enabled" : "Muted"}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
