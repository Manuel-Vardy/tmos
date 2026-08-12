import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Wallet,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  FlaskConical,
  BookOpen,
  Wrench,
  Trophy,
  FileSpreadsheet,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import { SCHOOL_EXPENSES, SCHOOL_SUMMARY, type SchoolExpense } from "@/lib/school-data";

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Trite Merchant OS" },
      {
        name: "description",
        content:
          "School operational expense management, petty cash vouchers, supplier bills, utilities, lab supplies, and approval workflow.",
      },
      { property: "og:title", content: "Expenses — Trite Merchant OS" },
    ],
  }),
  component: ExpensesPage,
});

type ExpenseCategory = SchoolExpense["category"];
type ApprovalStatus = SchoolExpense["status"];

const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Utilities & Fuel": {
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  "Lab Supplies": {
    icon: FlaskConical,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  },
  "Textbooks & Exam Papers": {
    icon: BookOpen,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  },
  "Facility Maintenance": {
    icon: Wrench,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800",
  },
  "Sports Equipment": {
    icon: Trophy,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  },
};

const STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; activePill: string }
> = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400 font-semibold",
    bg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800",
    activePill: "bg-emerald-600 text-white",
  },
  "Pending Approval": {
    label: "Pending Approval",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400 font-semibold",
    bg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800",
    activePill: "bg-amber-600 text-white",
  },
};

const CATEGORY_FILTERS = [
  "all",
  "Utilities & Fuel",
  "Lab Supplies",
  "Textbooks & Exam Papers",
  "Facility Maintenance",
  "Sports Equipment",
] as const;

function ExpensesPage() {
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filtered = SCHOOL_EXPENSES.filter((exp) => {
    const matchStatus = statusFilter === "all" || exp.status === statusFilter;
    const matchCat = categoryFilter === "all" || exp.category === categoryFilter;
    const matchSearch =
      search === "" ||
      exp.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.approvedBy.toLowerCase().includes(search.toLowerCase()) ||
      exp.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const totalShown = filtered.reduce((acc, e) => acc + e.amount, 0);

  return (
    <AppShell
      title="School Expenses & Vouchers"
      subtitle={`${SCHOOL_EXPENSES.length} vouchers this month · ${currency(SCHOOL_SUMMARY.totalMonthlyExpenses)} in total operational spend`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Raise Expense Voucher
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Spend</p>
            <span className="rounded-full bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Wallet className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{currency(SCHOOL_SUMMARY.totalMonthlyExpenses)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">August 2026</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Approved</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {SCHOOL_EXPENSES.filter((e) => e.status === "Approved").length} vouchers
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {currency(SCHOOL_EXPENSES.filter((e) => e.status === "Approved").reduce((a, e) => a + e.amount, 0))}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Approval</p>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {SCHOOL_EXPENSES.filter((e) => e.status === "Pending Approval").length} vouchers
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Awaiting headmaster sign-off</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Showing (Filtered)</p>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileSpreadsheet className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400">{currency(totalShown)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{filtered.length} vouchers in view</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voucher #, description, category or approver…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status filters */}
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-secondary text-muted-foreground hover:bg-border"
            }`}
          >
            All Vouchers
          </button>
          {(Object.keys(STATUS_CONFIG) as ApprovalStatus[]).map((st) => {
            const cfg = STATUS_CONFIG[st];
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  isSelected ? cfg.activePill : "bg-secondary text-muted-foreground hover:bg-border"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CATEGORY_FILTERS.map((cat) => {
          const isSelected = categoryFilter === cat;
          const cfg = cat !== "all" ? CATEGORY_CONFIG[cat as ExpenseCategory] : null;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as ExpenseCategory | "all")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                isSelected
                  ? cfg
                    ? `${cfg.bg} ${cfg.color}`
                    : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent"
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-border"
              }`}
            >
              {cfg && <cfg.icon className="size-3.5" />}
              {cat === "all" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>

      {/* Expenses Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exp) => {
          const catCfg = CATEGORY_CONFIG[exp.category];
          const CatIcon = catCfg.icon;
          const stCfg = STATUS_CONFIG[exp.status];
          const StIcon = stCfg.icon;
          return (
            <div
              key={exp.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/30"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`rounded-lg border p-2 ${catCfg.bg} ${catCfg.color}`}>
                      <CatIcon className="size-4" />
                    </span>
                    <div>
                      <span className="font-mono text-xs text-muted-foreground font-semibold">{exp.voucherNo}</span>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">{exp.category}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${stCfg.bg} ${stCfg.color}`}>
                    <StIcon className="size-3" />
                    {stCfg.label}
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-foreground leading-snug">{exp.description}</p>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium text-foreground">{exp.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved By</span>
                    <span className="font-medium text-foreground">{exp.approvedBy}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-foreground">{currency(exp.amount)}</span>
              </div>

              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  View Voucher
                </Button>
                {exp.status === "Pending Approval" && (
                  <Button size="sm" className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] text-xs">
                    Approve
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
