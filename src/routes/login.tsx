import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import type { InstitutionType } from "@/lib/institution-types";
import { INSTITUTION_TYPES } from "@/lib/institution-types";
import { INSTITUTION_META } from "@/lib/institution-config";
import { useInstitution } from "@/hooks/use-institution";
import AuthSectionTwo from "@/components/ui/auth-section-2";

// ---------------------------------------------------------------------------
// Session reader (mirrors the pattern in _authenticated.tsx / onboarding.tsx)
// ---------------------------------------------------------------------------

const SESSION_KEY = "tmos_session_v1";

function readSession(): {
  accountId?: string;
  onboardingComplete?: boolean;
  institutionType?: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed?.["version"] !== 1) return null;
    return parsed as {
      accountId?: string;
      onboardingComplete?: boolean;
      institutionType?: string;
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Route search params schema
// ---------------------------------------------------------------------------

const searchSchema = z.object({
  redirect: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Route definition
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  beforeLoad: () => {
    // Inverse guard: already authenticated + onboarded → go straight to dashboard
    const session = readSession();
    if (session?.accountId && session?.onboardingComplete) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — Trite Merchant OS" },
      {
        name: "description",
        content: "Sign in to your Trite Merchant OS account.",
      },
    ],
  }),
  component: LoginPage,
});

// Convert institution types for AuthSectionTwo button representation
const businessTypeButtons = INSTITUTION_TYPES.map((type) => ({
  id: type,
  label: INSTITUTION_META[type].label,
}));

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { institutionType: savedType, setInstitution } = useInstitution();

  const [selectedType, setSelectedType] = useState<string>(
    savedType ?? INSTITUTION_TYPES[0]
  );

  async function handleFormSubmit(data: {
    firstName: string;
    lastName: string;
    email: string;
    type: string;
  }) {
    const typeToUse = (data.type || selectedType) as InstitutionType;
    setInstitution(typeToUse, "acc-demo-001");
    const destination = search.redirect ?? "/";
    await navigate({ to: destination });
  }

  return (
    <AuthSectionTwo
      businessTypes={businessTypeButtons}
      selectedType={selectedType}
      onSelectType={(id) => setSelectedType(id)}
      onSubmit={handleFormSubmit}
    />
  );
}
