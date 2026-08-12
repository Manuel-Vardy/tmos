import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link } from "@tanstack/react-router";
import {
  HeartHandshake,
  Users,
  FolderKanban,
  Clock,
  Plus,
  PiggyBank,
  CheckCircle2,
  Globe,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { currency } from "@/lib/mos-data";
import {
  NGO_DONATIONS,
  NGO_MEMBERS,
  NGO_PROJECTS,
  BUDGET_APPROVALS,
  NGO_SUMMARY,
} from "@/lib/ngo-data";

export function NgoDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <AppShell
      title="NGO & Non-Profit Operations"
      subtitle="Donor contributions, community project budgets, member dues, and requisition approvals"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Link to="/donations">
            <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
              <Plus className="size-4" /> Record Donation
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="sm" variant="outline">
              <FolderKanban className="size-4" /> New Project
            </Button>
          </Link>
          <Link to="/budget">
            <Button size="sm" variant="outline">
              <PiggyBank className="size-4" /> Request Budget
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Donations Raised"
            value={currency(NGO_SUMMARY.totalDonationsRaised)}
            delta={18}
            sub={`${NGO_DONATIONS.length} contribution commitments`}
            icon={HeartHandshake}
          />
          <KpiCard
            label="Active Field Projects"
            value={NGO_SUMMARY.totalActiveProjects}
            sub={`${NGO_SUMMARY.totalBeneficiariesReached.toLocaleString()} community beneficiaries`}
            icon={FolderKanban}
          />
          <KpiCard
            label="Member Dues Collected"
            value={currency(NGO_SUMMARY.totalDuesCollected)}
            sub={`${NGO_MEMBERS.filter((m) => m.duesStatus === "Paid").length} cleared members`}
            icon={Users}
          />
          <KpiCard
            label="Pending Budget Requests"
            value={BUDGET_APPROVALS.filter((b) => b.status === "Pending Approval").length}
            sub={`Awaiting board approval`}
            icon={Clock}
          />
        </section>

        {/* Operations Overview Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Donor Contributions */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold">Recent Donor Contributions</h2>
              </div>
              <Link to="/donations" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                View All Donations →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {NGO_DONATIONS.map((don) => (
                <li key={don.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="font-semibold text-sm">{don.donorName}</p>
                    <p className="text-xs text-muted-foreground">{don.donorType} · {don.allocatedProject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      don.status === "Received"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200"
                    }`}>
                      {don.status}
                    </span>
                    <p className="font-bold text-sm text-foreground mt-0.5">
                      {don.currency === "USD" ? `$${don.amount.toLocaleString()} USD` : currency(don.amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Pending Field Budget Requisitions */}
          <Card className="p-0 overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="size-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-semibold">Budget Requisition Queue</h2>
              </div>
              <Link to="/budget" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                All Requisitions →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {BUDGET_APPROVALS.map((req) => (
                <li key={req.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="font-semibold text-sm">{req.projectName}</p>
                    <p className="text-xs text-muted-foreground">{req.requestNo} · {req.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Requested by {req.requestedBy}</p>
                    <p className="font-bold text-sm text-foreground">{currency(req.amountRequested)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Project Budgets & Spend Tracker */}
        <Card className="p-5 shadow-none">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="size-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold">Community Project Budgets & Execution</h2>
            </div>
            <Link to="/projects">
              <Button size="sm" variant="outline" className="text-xs">
                View Project Directory
              </Button>
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {NGO_PROJECTS.map((project) => {
              const pct = Math.round((project.fundsSpent / project.budgetAllocated) * 100);
              return (
                <div key={project.id} className="rounded-lg border border-border bg-secondary/20 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground font-semibold">{project.code}</span>
                      <h3 className="text-sm font-bold text-foreground">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">{project.location} · Lead: {project.leadCoordinator}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Budget: <span className="font-semibold text-foreground">{currency(project.budgetAllocated)}</span> · Spent: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currency(project.fundsSpent)}</span>
                      </p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {project.beneficiariesCount.toLocaleString()} beneficiaries
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-[#22c55e] transition-all"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
