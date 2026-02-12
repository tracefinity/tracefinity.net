"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PriceKey } from "@/lib/stripe";

interface PlanOption {
  name: string;
  rank: number;
  monthlyPrice: string;
  yearlyPrice: string;
  tools: string;
  priceKey: PriceKey;
  annualPriceKey: PriceKey;
}

const allPlans: PlanOption[] = [
  {
    name: "Standard",
    rank: 1,
    monthlyPrice: "7",
    yearlyPrice: "60",
    tools: "50 tools, unlimited bins",
    priceKey: "STANDARD_MONTHLY",
    annualPriceKey: "STANDARD_YEARLY",
  },
  {
    name: "Pro",
    rank: 2,
    monthlyPrice: "12",
    yearlyPrice: "100",
    tools: "200 tools, unlimited bins",
    priceKey: "PRO_MONTHLY",
    annualPriceKey: "PRO_YEARLY",
  },
];

export function PlanChangeSection({
  currentTierRank,
  cancellingAtPeriodEnd,
}: {
  currentTierRank: number;
  cancellingAtPeriodEnd: boolean;
}) {
  const upgrades = allPlans.filter((p) => p.rank > currentTierRank);
  const downgrades = allPlans.filter((p) => p.rank < currentTierRank);
  const canCancelToFree = currentTierRank > 0 && !cancellingAtPeriodEnd;

  if (upgrades.length === 0 && downgrades.length === 0 && !canCancelToFree) return null;

  return (
    <div className="mt-8">
      {upgrades.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Upgrade
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upgrades.map((plan) => (
              <UpgradeCard key={plan.name} plan={plan} />
            ))}
          </div>
        </>
      )}

      {(downgrades.length > 0 || canCancelToFree) && (
        <div className={upgrades.length > 0 ? "mt-6" : ""}>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Downgrade
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {downgrades.map((plan) => (
              <DowngradeCard key={plan.name} plan={plan} />
            ))}
            {canCancelToFree && <CancelToFreeCard />}
          </div>
        </div>
      )}
    </div>
  );
}

function UpgradeCard({ plan }: { plan: PlanOption }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(priceKey: PriceKey, label: string) {
    setLoading(label);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold">{plan.name}</h3>
      <p className="mt-1 text-xs text-text-secondary">{plan.tools}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => checkout(plan.annualPriceKey, "yearly")}
          disabled={!!loading}
          className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading === "yearly" ? "Loading..." : `€${plan.yearlyPrice}/yr`}
        </button>
        <button
          onClick={() => checkout(plan.priceKey, "monthly")}
          disabled={!!loading}
          className="flex-1 rounded-lg bg-elevated border border-white/6 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors disabled:opacity-50"
        >
          {loading === "monthly" ? "Loading..." : `€${plan.monthlyPrice}/mo`}
        </button>
      </div>
    </div>
  );
}

function DowngradeCard({ plan }: { plan: PlanOption }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDowngrade() {
    setLoading(true);
    await fetch("/api/stripe/downgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: plan.priceKey }),
    });
    setConfirm(false);
    setLoading(false);
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-sm text-text-secondary">
          Switch to {plan.name}? Your billing will be prorated.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDowngrade}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-500/10 text-red-400 px-3 py-2 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {loading ? "Switching..." : "Confirm"}
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 rounded-lg bg-elevated px-3 py-2 text-xs font-medium text-text-secondary hover:bg-border-subtle transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold">{plan.name}</h3>
      <p className="mt-1 text-xs text-text-secondary">{plan.tools}</p>
      <button
        onClick={() => setConfirm(true)}
        className="mt-3 w-full rounded-lg bg-elevated border border-white/6 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors"
      >
        Switch to {plan.name}
      </button>
    </div>
  );
}

function CancelToFreeCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await fetch("/api/stripe/downgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "FREE" }),
    });
    setConfirm(false);
    setLoading(false);
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-sm text-text-secondary">
          Cancel your subscription? You'll keep access until the end of your billing period.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-500/10 text-red-400 px-3 py-2 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Confirm"}
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 rounded-lg bg-elevated px-3 py-2 text-xs font-medium text-text-secondary hover:bg-border-subtle transition-colors"
          >
            Keep plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold">Free</h3>
      <p className="mt-1 text-xs text-text-secondary">5 tools, 2 bins</p>
      <button
        onClick={() => setConfirm(true)}
        className="mt-3 w-full rounded-lg bg-elevated border border-white/6 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors"
      >
        Cancel subscription
      </button>
    </div>
  );
}
