import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckoutButton } from "./checkout-button";
import type { PriceKey } from "@/lib/stripe";
import type { PlanTier } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for AI tool tracing and Gridfinity bin generation. Free plan included.",
  alternates: { canonical: "https://tracefinity.net/pricing" },
};

interface Plan {
  name: string;
  tier: PlanTier;
  price: string;
  interval: string;
  annual?: string;
  traces: string;
  tools: string;
  featured: boolean;
  priceKey?: PriceKey;
  annualPriceKey?: PriceKey;
}

const TIER_RANK: Record<PlanTier, number> = { FREE: 0, STANDARD: 1, PRO: 2 };

const plans: Plan[] = [
  {
    name: "Free",
    tier: "FREE",
    price: "0",
    interval: "forever",
    traces: "5 traces/mo",
    tools: "10 tools",
    featured: false,
  },
  {
    name: "Standard",
    tier: "STANDARD",
    price: "7",
    interval: "month",
    annual: "60",
    traces: "50 traces/mo",
    tools: "100 tools",
    featured: true,
    priceKey: "STANDARD_MONTHLY",
    annualPriceKey: "STANDARD_YEARLY",
  },
  {
    name: "Pro",
    tier: "PRO",
    price: "12",
    interval: "month",
    annual: "100",
    traces: "200 traces/mo",
    tools: "Unlimited tools",
    featured: false,
    priceKey: "PRO_MONTHLY",
    annualPriceKey: "PRO_YEARLY",
  },
];

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  let currentTier: PlanTier = "FREE";
  if (session?.user?.id) {
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    currentTier = (sub?.tier ?? "FREE") as PlanTier;
  }

  return (
    <main className="pt-12">
      <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 text-text-secondary text-sm">
        Start free, upgrade when you need more traces.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = isLoggedIn && plan.tier === currentTier;
          const isUpgrade = isLoggedIn && TIER_RANK[plan.tier] > TIER_RANK[currentTier];

          return (
            <div
              key={plan.name}
              className={`rounded-lg border p-5 ${
                isCurrent
                  ? "border-accent/50 bg-surface"
                  : plan.featured
                    ? "border-accent bg-surface"
                    : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  {plan.name}
                </h2>
                {isCurrent && (
                  <span className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-3">
                <span className="text-3xl font-semibold">
                  &#8364;{plan.price}
                </span>
                {plan.interval !== "forever" && (
                  <span className="text-sm text-text-muted">/{plan.interval}</span>
                )}
              </div>
              {plan.annual && (
                <p className="mt-1 text-xs text-text-muted">
                  or &#8364;{plan.annual}/year (save ~2 months)
                </p>
              )}
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>{plan.traces}</li>
                <li>{plan.tools}</li>
                <li>AI-powered tracing</li>
                <li>STL and 3MF export</li>
              </ul>

              {isCurrent ? (
                <p className="mt-5 block rounded-lg px-4 py-2 text-center text-sm font-medium text-text-muted bg-elevated">
                  Your plan
                </p>
              ) : plan.priceKey && isLoggedIn && isUpgrade ? (
                <div className="mt-5 space-y-2">
                  <CheckoutButton
                    priceKey={plan.priceKey}
                    label={`Upgrade monthly`}
                    featured={plan.featured}
                  />
                  {plan.annualPriceKey && (
                    <CheckoutButton
                      priceKey={plan.annualPriceKey}
                      label={`Upgrade yearly`}
                      featured={false}
                    />
                  )}
                </div>
              ) : (
                <Link
                  href={plan.priceKey ? `/signup?plan=${plan.name.toLowerCase()}` : "/signup"}
                  className={`mt-5 block rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
                    plan.featured
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "bg-elevated text-text-secondary hover:text-text-primary hover:bg-border-subtle"
                  }`}
                >
                  {isLoggedIn ? "Your plan" : "Get started"}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-text-muted">
        <p>All plans include the full tool tracing and bin generation workflow.</p>
        <p className="mt-1">
          Need more? <a href="mailto:hello@tracefinity.net" className="text-accent hover:text-text-primary transition-colors">Get in touch</a>.
        </p>
      </div>
    </main>
  );
}
