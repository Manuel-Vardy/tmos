import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { HOUSEKEEPING_TASKS, HOTEL_SUMMARY, type HousekeepingTask } from "@/lib/hotel-data";

export const Route = createFileRoute("/_authenticated/housekeeping")({
  head: () => ({
    meta: [
      { title: "Housekeeping — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Hotel housekeeping turnover schedule, room cleaning logs, staff assignments, and inspection sign-offs.",
      },
      { property: "og:title", content: "Housekeeping — Trite Merchant OS" },
    ],
  }),
  component: HousekeepingPage,
});

type TaskStatus = HousekeepingTask["status"];

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; activePill: string }
> = {
  "In Progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-indigo-600 dark:text-indigo-400 font-semibold",
    bg: "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800",
    activePill: "bg-indigo-600 text-white",
  },
  Pending: {
    label: "Pending",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400 font-semibold",
    bg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800",
    activePill: "bg-amber-500 text-white",
  },
  "Inspected & Passed": {
    label: "Inspected & Passed",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400 font-semibold",
    bg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800",
    activePill: "bg-emerald-600 text-white",
  },
};

function HousekeepingPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filtered = HOUSEKEEPING_TASKS.filter((task) => {
    const matchStatus = statusFilter === "all" || task.status === statusFilter;
    const matchSearch =
      search === "" ||
      task.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedStaff.toLowerCase().includes(search.toLowerCase()) ||
      task.cleaningType.toLowerCase().includes(search.toLowerCase()) ||
      task.roomType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AppShell
      title="Housekeeping & Turnover Queue"
      subtitle={`${HOTEL_SUMMARY.pendingHousekeeping} pending cleaning tasks · Daily turnover schedule & supervisor inspections`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Create Cleaning Task
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Turnover Tasks</p>
            <span className="rounded-full bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{HOUSEKEEPING_TASKS.length}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Logged today</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">In Progress</p>
            <span className="rounded-full bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {HOUSEKEEPING_TASKS.filter((h) => h.status === "In Progress").length} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Staff cleaning now</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Queue</p>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {HOUSEKEEPING_TASKS.filter((h) => h.status === "Pending").length} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Awaiting cleaner</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Inspected & Passed</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {HOUSEKEEPING_TASKS.filter((h) => h.status === "Inspected & Passed").length} rooms
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Ready for check-in</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room number, cleaner staff, cleaning type…"
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
            All Tasks
          </button>
          {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((st) => {
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

      {/* Housekeeping Tasks Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Room Number</th>
              <th className="px-4 py-3">Room Category</th>
              <th className="px-4 py-3">Cleaning Type</th>
              <th className="px-4 py-3">Assigned Cleaner</th>
              <th className="px-4 py-3">Logged Time</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((task) => {
              const cfg = STATUS_CONFIG[task.status];
              const Icon = cfg.icon;
              return (
                <tr key={task.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 font-bold text-foreground">{task.roomNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.roomType}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{task.cleaningType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.assignedStaff}</td>
                  <td className="px-4 py-3 text-xs font-mono">{task.timeLogged}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${task.priority === "High" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" : "bg-secondary text-muted-foreground"}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>
                      <Icon className="size-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {task.status !== "Inspected & Passed" ? (
                      <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a] text-xs h-7">
                        Inspect & Pass
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Completed
                      </Button>
                    )}
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
