import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  DoorOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Wrench,
  User,
  Calendar,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import { HOTEL_ROOMS, HOTEL_SUMMARY, type HotelRoom } from "@/lib/hotel-data";

export const Route = createFileRoute("/_authenticated/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Hotel room inventory management, occupancy status grid, nightly room rates, floor plans, and housekeeping status.",
      },
      { property: "og:title", content: "Rooms — Trite Merchant OS" },
    ],
  }),
  component: RoomsPage,
});

type RoomStatus = HotelRoom["status"];

const STATUS_CONFIG: Record<
  RoomStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; activePill: string }
> = {
  Occupied: {
    label: "Occupied",
    icon: User,
    color: "text-amber-600 dark:text-amber-400 font-semibold",
    bg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800",
    activePill: "bg-amber-500 text-white",
  },
  "Vacant Clean": {
    label: "Vacant Clean",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400 font-semibold",
    bg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800",
    activePill: "bg-emerald-600 text-white",
  },
  "Dirty / Cleaning": {
    label: "Dirty / Cleaning",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400 font-semibold",
    bg: "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800",
    activePill: "bg-blue-600 text-white",
  },
  Maintenance: {
    label: "Out of Order",
    icon: Wrench,
    color: "text-rose-600 dark:text-rose-400 font-semibold",
    bg: "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800",
    activePill: "bg-rose-600 text-white",
  },
};

function RoomsPage() {
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filtered = HOTEL_ROOMS.filter((rm) => {
    const matchStatus = statusFilter === "all" || rm.status === statusFilter;
    const matchSearch =
      search === "" ||
      rm.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      rm.roomType.toLowerCase().includes(search.toLowerCase()) ||
      rm.floor.toLowerCase().includes(search.toLowerCase()) ||
      (rm.currentGuest && rm.currentGuest.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <AppShell
      title="Room Inventory & Floor Status"
      subtitle={`${HOTEL_SUMMARY.totalRooms} rooms total · ${HOTEL_SUMMARY.occupiedRooms} occupied · ${HOTEL_SUMMARY.occupancyRate}% occupancy`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Add Room Category
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Rooms</p>
            <span className="rounded-full bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <DoorOpen className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{HOTEL_SUMMARY.totalRooms}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Inventory count</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Occupied</p>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <User className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {HOTEL_SUMMARY.occupiedRooms} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{HOTEL_SUMMARY.occupancyRate}% occupancy</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vacant Clean</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {HOTEL_ROOMS.filter((r) => r.status === "Vacant Clean").length} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Ready for check-in</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Needs Cleaning</p>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Sparkles className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {HOTEL_ROOMS.filter((r) => r.status === "Dirty / Cleaning").length} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Turnover queue</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room number, type, floor or guest name…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-secondary text-muted-foreground hover:bg-border"
            }`}
          >
            All Rooms
          </button>
          {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((st) => {
            const cfg = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === st ? cfg.activePill : "bg-secondary text-muted-foreground hover:bg-border"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rm) => {
          const cfg = STATUS_CONFIG[rm.status];
          const Icon = cfg.icon;
          return (
            <div
              key={rm.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/30"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{rm.floor}</span>
                    <h3 className="text-xl font-bold text-foreground">{rm.roomNumber}</h3>
                    <p className="text-xs text-muted-foreground">{rm.roomType}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>
                    <Icon className="size-3.5" />
                    {cfg.label}
                  </span>
                </div>

                <div className="my-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nightly Rate:</span>
                    <span className="font-bold text-foreground">{currency(rm.ratePerNight)} / night</span>
                  </div>

                  {rm.currentGuest && (
                    <div className="rounded-lg bg-secondary/40 p-2.5 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Current Guest</p>
                      <p className="font-bold text-foreground">{rm.currentGuest}</p>
                      <p className="text-muted-foreground text-[11px]">Check-out: {rm.checkOutDate}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Room Details
                </Button>
                {rm.status === "Vacant Clean" && (
                  <Button size="sm" className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] text-xs">
                    Assign Guest
                  </Button>
                )}
                {rm.status === "Dirty / Cleaning" && (
                  <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700 text-xs">
                    Mark Cleaned
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
