import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PLAN_LIMITS, type PlanTier } from "@/lib/plans";
import { syncSubscription } from "@/lib/sync-subscription";
import { SignOutButton } from "./sign-out-button";
import { PlanChangeSection } from "./plan-change-section";
import { ManageBillingButton } from "./manage-billing-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Tracefinity",
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

  // placeholder counts until the core app reports real usage
  const toolCount = 0;
  const binCount = 0;

  return (
    <main className="pt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Plan</p>
          <p className="mt-2 text-lg font-semibold">{tier}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
          <p className="mt-2 text-lg font-semibold">
            {toolCount}{" "}
            <span className="text-sm font-normal text-text-muted">
              / {limits.maxTools}
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Bins</p>
          <p className="mt-2 text-lg font-semibold">
            {binCount}{" "}
            <span className="text-sm font-normal text-text-muted">
              / {limits.maxBins === Infinity ? "unlimited" : limits.maxBins}
            </span>
          </p>
        </div>
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
    </main>
  );
}
