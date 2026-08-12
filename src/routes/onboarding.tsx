import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const SESSION_KEY = "tmos_session_v1";
function readSession(): { onboardingComplete?: boolean; accountId?: string; institutionType?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistInstitutionType(type: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}");
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...existing,
      version: 1,
      institutionType: type,
    }));
  } catch { /* silent */ }
}

function completeOnboarding(institutionType: string | null) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}");
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...existing,
      version: 1,
      institutionType: institutionType ?? existing.institutionType,
      onboardingComplete: true,
      accountId: existing.accountId ?? "acc-onboarding-001",
    }));
  } catch { /* silent */ }
}

import { Check, ArrowRight, ShieldCheck } from "lucide-react";

import { Wordmark } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InstitutionSelector } from "@/components/institution-selector";
import { INSTITUTION_META } from "@/lib/institution-config";
import type { InstitutionType } from "@/lib/institution-types";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    const session = readSession();
    if (session?.accountId && session?.onboardingComplete) {
      throw redirect({ to: "/" });
    }
  },
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

const steps = ["Institution type", "Verification", "First branch", "First product"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<InstitutionType | null>(null);
  const [institutionError, setInstitutionError] = useState<string | undefined>(undefined);

  const branchLabel = selectedInstitutionType
    ? INSTITUTION_META[selectedInstitutionType].branchLabel
    : "Branch";

  const handleContinue = () => {
    if (step === 0) {
      if (!selectedInstitutionType) {
        setInstitutionError("Please select an institution type to continue.");
        return;
      }
      setInstitutionError(undefined);
    }
    setStep((s) => s + 1);
  };

  const handleEnterDashboard = () => {
    completeOnboarding(selectedInstitutionType);
    navigate({ to: "/" });
  };

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
              <InstitutionSelector
                value={selectedInstitutionType}
                onChange={(type) => {
                  setSelectedInstitutionType(type);
                  setInstitutionError(undefined);
                  // Immediately persist to localStorage (Requirement 17.4)
                  persistInstitutionType(type);
                }}
                {...(institutionError != null ? { error: institutionError } : {})}
              />
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
                  [`${branchLabel} name`, `${branchLabel} Flagship`],
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
                onClick={handleContinue}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/85"
                onClick={handleEnterDashboard}
              >
                Enter dashboard <ArrowRight className="size-4" />
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
