import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import type { InstitutionType } from "@/lib/institution-types";
import { INSTITUTION_TYPES } from "@/lib/institution-types";
import { INSTITUTION_META } from "@/lib/institution-config";
import { useInstitution } from "@/hooks/use-institution";

const SESSION_KEY = "tmos_session_v1";

function readSession(): { accountId?: string; onboardingComplete?: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed?.["version"] !== 1) return null;
    return parsed as { accountId?: string; onboardingComplete?: boolean };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    const session = readSession();
    if (session?.accountId && session?.onboardingComplete) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Create account — Trite Merchant OS" },
      { name: "description", content: "Create your Trite Merchant OS account." },
    ],
  }),
  component: SignUpPage,
});

const businessTypeButtons = INSTITUTION_TYPES.map((type) => ({
  id: type,
  label: INSTITUTION_META[type].label,
}));

function SignUpPage() {
  const navigate = useNavigate();
  const { setInstitution } = useInstitution();
  const [selectedType, setSelectedType] = useState<string>(INSTITUTION_TYPES[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noEmails, setNoEmails] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const typeToUse = selectedType as InstitutionType;
    setInstitution(typeToUse, "acc-demo-001");
    try {
      const existing = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}");
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ ...existing, version: 1, onboardingComplete: true }),
      );
    } catch { /* silent */ }
    await navigate({ to: "/" });
  }

  return (
    <section className="min-h-screen bg-white text-black antialiased dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: hero panel */}
        <div className="flex flex-col items-center justify-center gap-6 overflow-hidden bg-[#eefce3] px-8 py-10 text-zinc-900 sm:px-12 lg:px-14 lg:py-16 xl:px-20">
          <div className="mx-auto w-full max-w-[480px] space-y-4 text-center">
            <img src="/tritee-logo.png" alt="Trite logo" className="mx-auto h-8 w-auto object-contain" />
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl lg:text-[36px] lg:leading-[1.15]">
              The operating system African businesses run on.
            </h1>
            <p className="text-sm font-normal text-zinc-700 sm:text-base leading-relaxed">
              Sell, stock, invoice, reconcile and get paid: cash, mobile money, card and stablecoins, across one branch or many.
            </p>
          </div>
          <div className="w-full max-w-[480px] overflow-hidden rounded-2xl shadow-md" style={{ height: "280px" }}>
            <img src="/images/woman-working.jpg" alt="Business owner using Trite" className="h-full w-full object-cover" />
          </div>
          <p className="mt-4 text-xs text-zinc-500 text-center">© Trite Software and Consultancy Services Limited</p>
        </div>

        {/* Right: sign-up form */}
        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
          <a href="/" className="absolute top-6 right-6 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            <span className="text-base leading-none">‹</span>
            Back to Dashboard
          </a>

          <div className="mx-auto w-full max-w-[500px]">
            {/* Business type selector */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight text-center text-black dark:text-white sm:text-2xl mb-4">
                What type of business are you signing up for?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {businessTypeButtons.map((item) => {
                  const isSelected = selectedType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedType(item.id)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 border-0 outline-none ${
                        isSelected
                          ? "bg-[#22c55e] text-white shadow-sm scale-105"
                          : "bg-black/5 text-black/80 hover:bg-black/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-black dark:text-white">
                Create an account
              </h1>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-[#22c55e] hover:underline underline-offset-2">
                  Sign in
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="First Name" type="text" value={firstName} onChange={setFirstName} placeholder="Kwame" />
                <InputField label="Last Name"  type="text" value={lastName}  onChange={setLastName}  placeholder="Mensah" />
              </div>
              <InputField label="Email"    type="email"    value={email}    onChange={setEmail}    placeholder="kwame.mensah@gmail.com" />
              <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" />

              <div className="space-y-3 pt-2 text-xs leading-4 text-black/60 dark:text-white/60">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noEmails}
                    onChange={(e) => setNoEmails(e.target.checked)}
                    className="mt-0.5 rounded border-black/25 dark:border-white/30 accent-[#22c55e]"
                  />
                  <span>I'd like to receive product updates, feature announcements, and marketing emails from Trite. You can unsubscribe at any time.</span>
                </label>
                <p className="text-xs text-black/50 dark:text-white/50">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="font-medium underline underline-offset-2 hover:text-[#22c55e]">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="font-medium underline underline-offset-2 hover:text-[#22c55e]">Privacy Policy</a>.
                </p>
              </div>

              <button
                type="submit"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-black text-base font-medium text-white transition-all hover:bg-black/85 hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label, type, value, onChange, placeholder,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label className="text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80">{label}</label>
      <div className="flex h-12 items-center rounded-xl border border-black/20 bg-white px-4 transition-all focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e] dark:border-white/20 dark:bg-white/5">
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-black outline-none dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
        />
      </div>
    </div>
  );
}
