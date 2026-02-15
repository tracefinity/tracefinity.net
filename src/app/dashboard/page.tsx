import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";
import { PLAN_LIMITS, type PlanTier } from "@/lib/plans";
import { syncSubscription } from "@/lib/sync-subscription";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
import { SignOutButton } from "./sign-out-button";
import { PlanChangeSection } from "./plan-change-section";
import { ManageBillingButton } from "./manage-billing-button";
import { UsageStats } from "./usage-stats";
import { VerifyBanner } from "./verify-banner";
import { DeleteAccountSection } from "./delete-account-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

const TIER_RANK: Record<PlanTier, number> = { FREE: 0, STANDARD: 1, PRO: 2 };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // sync with stripe on every load so we're never stale
  const subscription = await syncSubscription(session.user.id);

  const tier = (subscription?.tier ?? "FREE") as PlanTier;
  const limits = PLAN_LIMITS[tier];
  const hasBilling = !!subscription?.stripeCustomerId;

  const appToken = await new SignJWT({ id: session.user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);

  return (
    <main className="pt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {!session.user.emailVerified && <VerifyBanner />}

      <a
        href="/api/auth/app-token"
        className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
      >
        Open Tracefinity
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Plan</p>
          <p className="mt-2 text-lg font-semibold">{tier}</p>
        </div>
        <UsageStats
          maxTraces={limits.maxTraces}
          maxTools={limits.maxTools === Infinity ? null : limits.maxTools}
          appToken={appToken}
        />
      </div>

      {subscription?.status === "active" && tier !== "FREE" && subscription.currentPeriodEnd && (
        <p className="mt-4 text-xs text-text-muted">
          {subscription.cancelAtPeriodEnd
            ? `Cancels on ${subscription.currentPeriodEnd.toLocaleDateString()}`
            : `Renews on ${subscription.currentPeriodEnd.toLocaleDateString()}`}
        </p>
      )}

      {hasBilling && (
        <div className="mt-4">
          <ManageBillingButton />
        </div>
      )}

      <PlanChangeSection
        currentTierRank={TIER_RANK[tier]}
        cancellingAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
      />

      <DeleteAccountSection email={session.user.email!} />
    </main>
  );
}
