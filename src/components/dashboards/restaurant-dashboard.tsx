import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Banknote,
  ChefHat,
  Trash2,
  Plus,
  UtensilsCrossed,
  Receipt,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { KpiCard } from "@/components/kpi-card";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { cn } from "@/lib/utils";
import { currency } from "@/lib/mos-data";
import {
  RESTAURANT_TABLES,
  KITCHEN_ORDERS,
  MENU_ITEMS,
  WASTAGE_LOGS,
  RESTAURANT_SUMMARY,
} from "@/lib/restaurant-data";

const topMenuItems = [
  { name: "Jollof & Tilapia", revenue: 3990 },
  { name: "Grilled Goat Chops", revenue: 3640 },
  { name: "Banku & Tilapia", revenue: 3510 },
  { name: "Fresh Sobolo Drink", revenue: 2200 },
  { name: "Fried Kelewele", revenue: 2275 },
  { name: "Seafood Platter", revenue: 3920 },
];

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

export function RestaurantDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <AppShell
      title="Restaurant & Hospitality Operations"
      subtitle="Today's floor plan, live kitchen tickets, menu sales & wastage metrics"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Link to="/tables">
            <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
              <Plus className="size-4" /> Open Table
            </Button>
          </Link>
          <Link to="/kitchen">
            <Button size="sm" variant="outline">
              <ChefHat className="size-4" /> KDS Display
            </Button>
          </Link>
          <Link to="/wastage">
            <Button size="sm" variant="outline">
              <Trash2 className="size-4" /> Log Wastage
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Occupied Tables"
            value={`${RESTAURANT_SUMMARY.totalOccupiedTables} / ${RESTAURANT_TABLES.length}`}
            delta={12.4}
            sub={`${RESTAURANT_SUMMARY.totalAvailableTables} tables ready`}
            icon={UtensilsCrossed}
          />
          <KpiCard
            label="Unbilled Order Tabs"
            value={currency(RESTAURANT_SUMMARY.activeOrderRevenue)}
            sub="open guest checks"
            icon={Banknote}
          />
          <KpiCard
            label="Kitchen Prep Tickets"
            value={RESTAURANT_SUMMARY.activeKitchenTickets}
            sub="tickets on stations"
            icon={ChefHat}
          />
          <KpiCard
            label="Today Wastage Value"
            value={currency(RESTAURANT_SUMMARY.todayWastageCost)}
            sub="spoilage & cook loss"
            icon={Trash2}
          />
        </section>

        {/* Live Operations Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Live Kitchen KDS Queue */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ChefHat className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold">Active Kitchen Tickets</h2>
              </div>
              <Link to="/kitchen" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                Open KDS →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {KITCHEN_ORDERS.map((ticket) => (
                <li key={ticket.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Table {ticket.tableNumber} ({ticket.section})</span>
                      <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {ticket.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-400">
                    {ticket.status} · {ticket.prepTimeMinutes}m
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Top Dishes Bar Chart */}
          <Card className="p-5 shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Top Selling Menu Items</h2>
                <p className="text-xs text-muted-foreground">Revenue breakdown by dish category</p>
              </div>
              <Link to="/menu" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                Manage Menu →
              </Link>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topMenuItems}
                  layout="vertical"
                  margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--color-muted-foreground)"
                    tickFormatter={(v: number) => `GHS ${v.toLocaleString("en-GH")}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-secondary)" }}
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`GHS ${v.toLocaleString("en-GH")}`, "Revenue"]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Live Table Seating Grid Preview */}
        <Card className="p-5 shadow-none">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-semibold">Floor Seating Overview</h2>
              <p className="text-xs text-muted-foreground">Live occupied vs available tables across sections</p>
            </div>
            <Link to="/tables">
              <Button size="sm" variant="outline" className="text-xs">
                View Full Floor Plan
              </Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {RESTAURANT_TABLES.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-border bg-secondary/30 p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Table {t.number}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      t.status === "occupied"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : t.status === "billing"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : t.status === "reserved"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t.section} · {t.seats} seats</p>
                {t.currentOrder && (
                  <p className="mt-1 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                    {currency(t.currentOrder.total)} ({t.currentOrder.server})
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
