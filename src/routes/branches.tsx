import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Users, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { branches, currency } from "@/lib/mos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branch management — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Create branches, assign staff, set per-branch settlement destinations and toggle roll-up versus per-branch reporting.",
      },
      { property: "og:title", content: "Branch management — Trite Merchant OS" },
      {
        property: "og:description",
        content: "Multi-branch is first class: per-branch stock, staff, sales and settlement.",
      },
    ],
  }),
  component: Branches,
});

function Branches() {
  const [view, setView] = useState<"rollup" | "per-branch">("rollup");
  const list = branches.slice(1);

  return (
    <AppShell
      title="Branch management"
      subtitle="4 branches · 34 staff · Sarpong Retail Ltd"
      actions={
        <>
          <div className="flex rounded-md border border-border p-0.5">
            {(["rollup", "per-branch"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  view === v
                    ? v === "rollup"
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "rollup" ? "Roll-up" : "Per branch"}
              </button>
            ))}
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/85">
            <Plus className="size-4" /> Add branch
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {view === "rollup" && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { l: "Consolidated revenue", v: currency(482_310) },
              { l: "Stock value held", v: currency(611_400) },
              { l: "Settlement accounts", v: "3 destinations" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">{s.l}</p>
                <p className="num mt-2 text-xl font-bold">{s.v}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((b) => {
            const up = b.growth >= 0;
            return (
              <div key={b.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-semibold">{b.name}</h2>
                    <p className="text-xs text-muted-foreground">{b.city}</p>
                  </div>
                  <StatusBadge tone={up ? "good" : "warn"}>
                    {up ? "Growing" : "Declining"}
                  </StatusBadge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="num font-semibold">{currency(b.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock value</p>
                    <p className="num font-semibold">{currency(b.stockValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Week on week</p>
                    <p
                      className={cn(
                        "num inline-flex items-center gap-0.5 font-semibold",
                        !up && "text-destructive",
                      )}
                    >
                      {up ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                      {Math.abs(b.growth)}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" /> {b.staff} staff assigned
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="size-3.5" /> {b.settlement}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage staff
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Branch dashboard
                  </Button>
                </div>
              </div>
            );
          })}

          <button className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/50 p-6 text-center transition-colors hover:border-accent">
            <Plus className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">Add another branch</p>
            <p className="max-w-56 text-xs text-muted-foreground">
              Unlimited branches under one organisation, each with its own stock and settlement
              destination.
            </p>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
