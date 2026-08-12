import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Banknote,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import {
  SCHOOL_STUDENTS,
  FEE_TRANSACTIONS,
  SCHOOL_SUMMARY,
} from "@/lib/school-data";

export const Route = createFileRoute("/_authenticated/fees")({
  head: () => ({
    meta: [
      { title: "Fee Management — Trite Merchant OS" },
      {
        name: "description",
        content:
          "School fee billing, tuition collection ledger, term payments, arrears tracking, and Mobile Money fee reconciliation.",
      },
      { property: "og:title", content: "Fee Management — Trite Merchant OS" },
    ],
  }),
  component: FeeManagementPage,
});

function FeeManagementPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredTransactions = FEE_TRANSACTIONS.filter((tx) => {
    const matchSearch =
      search === "" ||
      tx.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.studentName.toLowerCase().includes(search.toLowerCase()) ||
      tx.studentId.toLowerCase().includes(search.toLowerCase()) ||
      tx.gradeClass.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <AppShell
      title="Fee Management & Collection Ledger"
      subtitle={`Term 3 Tuition: ${currency(SCHOOL_SUMMARY.totalFeesCollected)} collected · ${currency(SCHOOL_SUMMARY.totalOutstandingFees)} in outstanding fee arrears`}
      actions={
        <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
          <Plus className="size-4" /> Collect Fee Payment
        </Button>
      }
    >
      {/* Stat Summaries */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Collected</p>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Banknote className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {currency(SCHOOL_SUMMARY.totalFeesCollected)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Term 3 fees received</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fee Arrears</p>
            <span className="rounded-full bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertCircle className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {currency(SCHOOL_SUMMARY.totalOutstandingFees)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Unpaid tuition balance</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment Receipts</p>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Receipt className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {FEE_TRANSACTIONS.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Issued this term</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cleared Students</p>
            <span className="rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {SCHOOL_STUDENTS.filter((s) => s.status === "Paid Full").length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">100% fees paid</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt #, student name, ID or class…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="size-4" /> Export Ledger
          </Button>
        </div>
      </div>

      {/* Fee Payments Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Receipt No</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3 font-bold">Amount Paid</th>
              <th className="hidden px-4 py-3 md:table-cell">Received By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{tx.receiptNo}</td>
                <td className="px-4 py-3 text-muted-foreground">{tx.date}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{tx.studentName}</p>
                  <p className="text-xs text-muted-foreground">{tx.studentId}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tx.gradeClass}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {tx.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{currency(tx.amountPaid)}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{tx.receivedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
