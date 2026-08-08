import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Store, Building2, Check, ArrowRight, ShieldCheck } from "lucide-react";

import { Wordmark } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — Trite Merchant OS" },
      {
        name: "description",
        content:
          "Set up your Trite merchant account: choose single location or multi-branch, complete KYC, add your first branch and first product.",
      },
      { property: "og:title", content: "Get started — Trite Merchant OS" },
      {
        property: "og:description",
        content: "KYC-gated onboarding for Ghanaian shops, chains and services firms.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = ["Business type", "Verification", "First branch", "First product"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"single" | "multi">("single");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-80 shrink-0 flex-col justify-between bg-sidebar p-8 text-sidebar-foreground lg:flex">
        <Wordmark className="h-8" />
        <div>
          <h2 className="font-display text-2xl leading-tight font-bold text-sidebar-accent-foreground">
            The operating system African businesses run on.
          </h2>
          <p className="mt-3 text-sm opacity-70">
            Sell, stock, invoice, reconcile and get paid — cash, mobile money, card and stablecoins,
            across one branch or fifty.
          </p>
          <ol className="mt-8 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border text-xs",
                    i < step
                      ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                      : i === step
                        ? "border-sidebar-primary text-sidebar-primary"
                        : "border-sidebar-border opacity-50",
                  )}
                >
                  {i < step ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className={cn(i === step && "font-medium text-sidebar-accent-foreground")}>
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-xs opacity-50">© Trite Software and Consultancy Services Limited</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Step {step + 1} of {steps.length}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{steps[step]}</h1>

          <div className="mt-6 space-y-4">
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    id: "single" as const,
                    icon: Store,
                    title: "Single location",
                    body: "One shop, one till, one stock list.",
                  },
                  {
                    id: "multi" as const,
                    icon: Building2,
                    title: "Multi-branch organisation",
                    body: "Several outlets rolling up to one HQ view.",
                  },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setType(o.id)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-colors",
                      type === o.id
                        ? "border-accent bg-accent/15"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <o.icon className="size-5" />
                    <p className="mt-3 font-medium">{o.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{o.body}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  <p className="text-sm font-medium">KYC verification</p>
                  <StatusBadge tone="warn" className="ml-auto">
                    2 of 3 complete
                  </StatusBadge>
                </div>
                {[
                  ["Business registration certificate", true],
                  ["Director's Ghana Card", true],
                  ["Settlement account proof", false],
                ].map(([l, done]) => (
                  <div
                    key={l as string}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm"
                  >
                    <span>{l as string}</span>
                    {done ? (
                      <StatusBadge tone="good">Verified</StatusBadge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                {[
                  ["Branch name", "Osu Flagship"],
                  ["City", "Accra"],
                  ["Settlement destination", "GCB · ****4410"],
                ].map(([l, ph]) => (
                  <div key={l}>
                    <label className="text-xs font-medium text-muted-foreground">{l}</label>
                    <input
                      placeholder={ph}
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-ring"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                {[
                  ["Product name", "Shea Butter Tub"],
                  ["SKU / barcode", "TRT-1001"],
                  ["Price (GHS)", "65.00"],
                  ["Opening stock", "24"],
                ].map(([l, ph]) => (
                  <div key={l}>
                    <label className="text-xs font-medium text-muted-foreground">{l}</label>
                    <input
                      placeholder={ph}
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-ring"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/85"
                onClick={() => setStep((s) => s + 1)}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/85">
                <Link to="/">
                  Enter dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
            <Link to="/" className="ml-auto text-sm text-muted-foreground hover:text-foreground">
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
