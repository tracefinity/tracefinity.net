import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// tier from stripe price ID
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

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) break;

      const sub = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      const priceId = sub.items.data[0]?.price.id;
      const userId = sub.metadata.userId;
      if (!userId) break;

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: priceId,
          tier: tierFromPriceId(priceId),
          status: sub.status,
          currentPeriodStart: new Date(sub.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(sub.items.data[0].current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
        create: {
          userId,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: priceId,
          tier: tierFromPriceId(priceId),
          status: sub.status,
          currentPeriodStart: new Date(sub.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(sub.items.data[0].current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata.userId;
      if (!userId) break;

      const priceId = sub.items.data[0]?.price.id;
      const isDeleted = event.type === "customer.subscription.deleted";

      await prisma.subscription.update({
        where: { userId },
        data: {
          stripePriceId: priceId,
          tier: isDeleted ? "FREE" : tierFromPriceId(priceId),
          status: sub.status,
          currentPeriodStart: new Date(sub.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(sub.items.data[0].current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = typeof invoice.parent?.subscription_details?.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : null;
      if (!subId) break;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subId },
        data: { status: "past_due" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
