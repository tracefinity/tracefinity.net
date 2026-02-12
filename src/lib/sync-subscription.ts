import { stripe } from "./stripe";
import { prisma } from "./db";

// resolve tier from a stripe price ID
function tierFromPriceId(priceId: string): string {
  const standardPrices = [
    process.env.STRIPE_PRICE_STANDARD_MONTHLY,
    process.env.STRIPE_PRICE_STANDARD_YEARLY,
  ];
  const proPrices = [
    process.env.STRIPE_PRICE_PRO_MONTHLY,
    process.env.STRIPE_PRICE_PRO_YEARLY,
  ];

  if (standardPrices.includes(priceId)) return "STANDARD";
  if (proPrices.includes(priceId)) return "PRO";
  return "FREE";
}

// pull latest subscription state from stripe and update our db.
// call this on dashboard load so we're never stale for long.
export async function syncSubscription(userId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!sub?.stripeSubscriptionId) return sub;

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const priceId = stripeSub.items.data[0]?.price.id;
    const isActive = ["active", "trialing"].includes(stripeSub.status);

    const updated = await prisma.subscription.update({
      where: { userId },
      data: {
        status: stripeSub.status,
        tier: isActive && priceId ? tierFromPriceId(priceId) : "FREE",
        stripePriceId: priceId,
        currentPeriodStart: new Date(stripeSub.items.data[0].current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.items.data[0].current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    });

    return updated;
  } catch {
    // stripe unreachable - return what we have
    return sub;
  }
}
