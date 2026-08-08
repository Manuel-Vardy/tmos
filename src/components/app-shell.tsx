import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanLine,
  Boxes,
  Building2,
  FileText,
  ScrollText,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Wifi,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { branches } from "@/lib/mos-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { group: "Overview", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Operate",
    items: [
      { to: "/pos", label: "Checkout / POS", icon: ScanLine },
      { to: "/inventory", label: "Inventory", icon: Boxes },
      { to: "/delivery", label: "Delivery", icon: Truck },
    ],
  },
  {
    group: "Money",
    items: [
      { to: "/invoices", label: "Invoicing", icon: FileText },
      { to: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    group: "Organisation",
    items: [
      { to: "/branches", label: "Branches", icon: Building2 },
      { to: "/audit", label: "Audit trail", icon: ScrollText },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src="/Trite-WB.png"
      alt="Trite logo"
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
}

function BranchSwitcher() {
  const [current, setCurrent] = useState(branches[0]!);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-secondary">
        <Building2 className="size-4 text-muted-foreground" />
        <span className="hidden sm:block">
          <span className="block leading-tight font-medium">{current.name}</span>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            {current.city}
          </span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Branch context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((b) => (
          <DropdownMenuItem key={b.id} onSelect={() => setCurrent(b)} className="gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full",
                b.id === current.id ? "bg-accent" : "bg-border",
              )}
            />
            <span className="flex-1">{b.name}</span>
            <span className="text-xs text-muted-foreground">{b.city}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center px-5 text-sidebar-accent-foreground">
          <Wordmark />
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {nav.map((section) => (
            <div key={section.group}>
              <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.14em] uppercase opacity-50">
                {section.group}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/60",
                        )}
                      >
                        <item.icon className="size-4 shrink-0 opacity-80" />
                        <span className="flex-1">{item.label}</span>
                        {active && <span className="size-1.5 rounded-full bg-sidebar-primary" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="grid size-8 place-items-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
              ES
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
                Efua Sarpong
              </p>
              <p className="truncate text-[11px] opacity-60">Owner · Sarpong Retail Ltd</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <Wordmark className="h-6 lg:hidden" />
            <BranchSwitcher />
            <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search products, invoices, transactions…"
                className="h-9 w-full rounded-md border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="ml-auto flex items-center gap-2 md:ml-0">
              <span className="hidden items-center gap-1.5 rounded-full border border-accent bg-accent/20 px-2.5 py-1 text-xs font-medium sm:inline-flex">
                <Wifi className="size-3.5" /> Online · synced
              </span>
              <button className="relative grid size-9 place-items-center rounded-md border border-border bg-card transition-colors hover:bg-secondary">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3 border-t border-border px-4 py-4 lg:px-6">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>

        <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border bg-card px-2 py-1.5 lg:hidden">
          {[
            nav[0].items[0],
            nav[1].items[0],
            nav[1].items[1],
            nav[2].items[0],
            nav[3].items[0],
          ].map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-[10px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
