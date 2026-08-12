import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  AlertCircle,
  CalendarDays,
  Banknote,
  Wallet,
  Plus,
  Receipt,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import {
  SCHOOL_STUDENTS,
  FEE_TRANSACTIONS,
  STAFF_PAYROLL,
  SCHOOL_EXPENSES,
  SCHOOL_SUMMARY,
  GRADE_ORDER,
} from "@/lib/school-data";

// Calculate real fee collection % for every active grade in school-data
const chartData = GRADE_ORDER.map((grade) => {
  const students = SCHOOL_STUDENTS.filter((s) => s.gradeClass === grade);
  if (students.length === 0) return { grade, collected: 0 };
  const totalFee = students.reduce((a, s) => a + s.tuitionFee, 0);
  const totalPaid = students.reduce((a, s) => a + s.paidAmount, 0);
  return { grade, collected: Math.round((totalPaid / totalFee) * 100) };
}).filter((d) => d.collected > 0 || SCHOOL_STUDENTS.some((s) => s.gradeClass === d.grade));

function barColor(pct: number): string {
  if (pct >= 90) return "#22c55e"; // emerald-500
  if (pct >= 70) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

export function SchoolDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <AppShell
      title="School & Academic Operations"
      subtitle="Term fee collection, student billing, staff payroll, and operational expenses"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Link to="/students">
            <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
              <Plus className="size-4" /> Enroll Student
            </Button>
          </Link>
          <Link to="/fees">
            <Button size="sm" variant="outline">
              <Banknote className="size-4" /> Collect Fee
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Fees Collected"
            value={currency(SCHOOL_SUMMARY.totalFeesCollected)}
            delta={15}
            sub={`${SCHOOL_STUDENTS.filter((s) => s.status === "Paid Full").length} fully cleared students`}
            icon={GraduationCap}
          />
          <KpiCard
            label="Fee Arrears"
            value={currency(SCHOOL_SUMMARY.totalOutstandingFees)}
            sub={`${SCHOOL_STUDENTS.filter((s) => s.balanceDue > 0).length} students with balance due`}
            icon={AlertCircle}
          />
          <KpiCard
            label="Monthly Payroll"
            value={currency(SCHOOL_SUMMARY.totalMonthlyPayroll)}
            sub={`${STAFF_PAYROLL.filter((s) => s.status === "Processing").length} staff processing`}
            icon={Users}
          />
          <KpiCard
            label="Payroll Due Date"
            value="15 Aug"
            sub="4 days remaining"
            icon={CalendarDays}
          />
        </section>

        {/* Operations Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student Fee Standing Preview */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold">Student Fee Standing</h2>
              </div>
              <Link to="/students" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                All Students ({SCHOOL_STUDENTS.length}) →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {SCHOOL_STUDENTS.slice(0, 6).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.gradeClass} · {s.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance Due</p>
                    <p className={`font-bold text-sm ${s.balanceDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {s.balanceDue > 0 ? currency(s.balanceDue) : "Cleared ✓"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent Fee Payments */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold">Recent Fee Payments</h2>
              </div>
              <Link to="/receipts" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                All Receipts ({FEE_TRANSACTIONS.length}) →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {FEE_TRANSACTIONS.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-semibold text-sm">{tx.studentName}</p>
                    <p className="text-xs text-muted-foreground">{tx.receiptNo} · {tx.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{tx.date}</p>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {currency(tx.amountPaid)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Fee Collection Chart */}
        <Card className="p-5 shadow-none">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Fee Collection Progress by Class (Creche → JHS 3)</h2>
              <p className="text-xs text-muted-foreground">% of expected term tuition collected per grade level</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-sm bg-emerald-500" />≥ 90% — On track
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-sm bg-amber-500" />70–89% — Behind
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-sm bg-red-500" />&lt; 70% — At risk
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -12, right: 4, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="grade" tickLine={false} axisLine={false} fontSize={10} stroke="var(--color-muted-foreground)" />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`${v}%`, "Collected"]}
                />
                <Bar dataKey="collected" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.grade} fill={barColor(entry.collected)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bottom Row: Payroll + Expenses */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Staff Payroll Summary */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-semibold">Staff Payroll Summary</h2>
              </div>
              <Link to="/payroll" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                Full Payroll ({STAFF_PAYROLL.length}) →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {STAFF_PAYROLL.map((staff) => (
                <li key={staff.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-semibold text-sm">{staff.name}</p>
                    <p className="text-xs text-muted-foreground">{staff.role}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      staff.status === "Paid"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}>
                      {staff.status}
                    </span>
                    <p className="font-bold text-sm">{currency(staff.netPay)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent Expense Vouchers */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Wallet className="size-4 text-slate-600 dark:text-slate-400" />
                <h2 className="text-sm font-semibold">Recent Expense Vouchers</h2>
              </div>
              <Link to="/expenses" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                All Expenses ({SCHOOL_EXPENSES.length}) →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {SCHOOL_EXPENSES.map((exp) => (
                <li key={exp.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-semibold text-sm">{exp.category}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{exp.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">{exp.date}</p>
                    <p className="font-bold text-sm">{currency(exp.amount)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
