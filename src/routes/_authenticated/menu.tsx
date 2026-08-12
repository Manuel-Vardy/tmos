import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  FileText,
  Plus,
  Search,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import { MENU_ITEMS, type MenuItem } from "@/lib/restaurant-data";

export const Route = createFileRoute("/_authenticated/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Recipes — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Manage restaurant dish catalog, prices, recipe ingredient costs, preparation stations, and availability status.",
      },
      { property: "og:title", content: "Menu & Recipes — Trite Merchant OS" },
    ],
  }),
  component: MenuAndRecipes,
});

type Category = "All Categories" | MenuItem["category"];

function MenuAndRecipes() {
  const [categoryFilter, setCategoryFilter] = useState<Category>("All Categories");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchCat = categoryFilter === "All Categories" || item.category === categoryFilter;
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.preparationStation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalMenuItems = MENU_ITEMS.length;
  const avgMargin = Math.round(
    (MENU_ITEMS.reduce((acc, m) => acc + (m.price - m.cost) / m.price, 0) / totalMenuItems) * 100
  );

  return (
    <AppShell
      title="Menu & Recipe Costing"
      subtitle={`${totalMenuItems} dishes & drinks · ${avgMargin}% average food margin across menu`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Add Menu Item
        </Button>
      }
    >
      {/* Stat Summaries */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Menu Dishes</p>
            <span className="rounded-full bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <UtensilsCrossed className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{totalMenuItems}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Active in catalog</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg Dish Margin</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{avgMargin}%</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Gross profit margin</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Top Seller Today</p>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileText className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-lg font-bold truncate">Sobolo Drink</p>
          <p className="mt-0.5 text-xs text-muted-foreground">88 orders served today</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Available Dishes</p>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {MENU_ITEMS.filter((m) => m.available).length} / {totalMenuItems}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">100% in stock</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name, station or category…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["All Categories", "Mains", "Starters", "Grill", "Seafood", "Drinks"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-secondary text-muted-foreground hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Dish Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Station</th>
              <th className="px-4 py-3">Selling Price</th>
              <th className="hidden px-4 py-3 md:table-cell">Recipe Cost</th>
              <th className="hidden px-4 py-3 lg:table-cell">Margin %</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((dish) => {
              const margin = Math.round(((dish.price - dish.cost) / dish.price) * 100);
              return (
                <tr key={dish.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Recipe: {dish.ingredients.map((ing) => `${ing.qty} ${ing.name}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">{dish.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground font-medium">
                      {dish.preparationStation}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{currency(dish.price)}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{currency(dish.cost)}</td>
                  <td className="hidden px-4 py-3 lg:table-cell font-semibold text-emerald-600 dark:text-emerald-400">
                    {margin}%
                  </td>
                  <td className="px-4 py-3">
                    {dish.available ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400">
                        <XCircle className="size-3" /> 86'd / Out
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="text-xs">
                      Edit Recipe
                    </Button>
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
