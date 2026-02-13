import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, PRICE_IDS, type PriceKey } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`downgrade:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { target } = (await request.json()) as { target: "FREE" | PriceKey };

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!sub?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active subscription." }, { status: 400 });
  }

  if (target === "FREE") {
    // cancel at period end so they keep access until it expires
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { cancelAtPeriodEnd: true },
    });

    return NextResponse.json({ status: "cancelling" });
  }

  // switch to a different paid tier
  const newPriceId = PRICE_IDS[target];
  if (!newPriceId) {
    return NextResponse.json({ error: "Invalid target." }, { status: 400 });
  }

  const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
  const itemId = stripeSub.items.data[0]?.id;
  if (!itemId) {
    return NextResponse.json({ error: "Subscription item not found." }, { status: 400 });
  }

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    items: [{ id: itemId, price: newPriceId }],
    proration_behavior: "create_prorations",
  });

  return NextResponse.json({ status: "switched" });
}
