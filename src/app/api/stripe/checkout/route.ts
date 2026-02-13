import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, PRICE_IDS, type PriceKey } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`checkout:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { priceKey } = (await request.json()) as { priceKey: PriceKey };
  const priceId = PRICE_IDS[priceKey];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  // reuse existing stripe customer if we have one
  let customerId = sub?.stripeCustomerId ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: session.user.id,
        tier: "FREE",
        stripeCustomerId: customerId,
      },
    });
  }

  const origin = new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=true`,
    cancel_url: `${origin}/pricing`,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
