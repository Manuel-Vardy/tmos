import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import { STAFF_PAYROLL, SCHOOL_SUMMARY, type StaffPayroll } from "@/lib/school-data";

export const Route = createFileRoute("/_authenticated/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Teacher and staff salary management, allowances, statutory SSNIT deductions, net pay calculation, and bank disbursements.",
      },
      { property: "og:title", content: "Payroll — Trite Merchant OS" },
    ],
  }),
  component: PayrollPage,
});

type PayStatus = StaffPayroll["status"];

const STATUS_CONFIG: Record<
  PayStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; activePill: string }
> = {
  Paid: {
    label: "Paid",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400 font-semibold",
    bg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800",
    activePill: "bg-emerald-600 text-white",
  },
  Processing: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400 font-semibold",
    bg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800",
    activePill: "bg-amber-600 text-white",
  },
};

function PayrollPage() {
  const [statusFilter, setStatusFilter] = useState<PayStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filtered = STAFF_PAYROLL.filter((staff) => {
    const matchStatus = statusFilter === "all" || staff.status === statusFilter;
    const matchSearch =
      search === "" ||
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase()) ||
      staff.staffId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AppShell
      title="Staff & Teacher Payroll"
      subtitle={`${STAFF_PAYROLL.length} academic & administrative staff · ${currency(SCHOOL_SUMMARY.totalMonthlyPayroll)} total monthly salary commitment`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Run Monthly Payroll
        </Button>
      }
    >
      {/* Stat Summaries */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Monthly Net Payroll</p>
            <span className="rounded-full bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <DollarSign className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{currency(SCHOOL_SUMMARY.totalMonthlyPayroll)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">August 2026 payroll</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Staff</p>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {STAFF_PAYROLL.length} employees
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Teachers & Admins</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Disbursed Salaries</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {STAFF_PAYROLL.filter((s) => s.status === "Paid").length} / {STAFF_PAYROLL.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Paid to bank accounts</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Processing</p>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {STAFF_PAYROLL.filter((s) => s.status === "Processing").length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Awaiting approval</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff name, role, staff ID or bank…"
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
            All Staff
          </button>
          {(Object.keys(STATUS_CONFIG) as PayStatus[]).map((st) => {
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

      {/* Staff Payroll Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Staff ID</th>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Basic Salary</th>
              <th className="hidden px-4 py-3 md:table-cell">Allowances</th>
              <th className="hidden px-4 py-3 md:table-cell">Deductions</th>
              <th className="px-4 py-3 font-bold">Net Pay</th>
              <th className="px-4 py-3">Bank Details</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((staff) => {
              const cfg = STATUS_CONFIG[staff.status];
              const Icon = cfg.icon;
              return (
                <tr key={staff.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{staff.staffId}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{staff.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{staff.role}</td>
                  <td className="px-4 py-3 font-medium">{currency(staff.basicSalary)}</td>
                  <td className="hidden px-4 py-3 text-emerald-600 dark:text-emerald-400 md:table-cell">
                    +{currency(staff.allowances)}
                  </td>
                  <td className="hidden px-4 py-3 text-rose-600 dark:text-rose-400 md:table-cell">
                    -{currency(staff.deductions)}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{currency(staff.netPay)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{staff.bankAccount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>
                      <Icon className="size-3" />
                      {cfg.label}
                    </span>
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
