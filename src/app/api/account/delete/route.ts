import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const CORE_APP_URL = process.env.CORE_APP_INTERNAL_URL || "http://core:3000";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { allowed } = rateLimit(`delete-account:${session.user.id}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { confirmEmail } = await request.json();
  if (!confirmEmail || confirmEmail !== session.user.email) {
    return NextResponse.json({ error: "Email does not match." }, { status: 400 });
  }

  const userId = session.user.id;

  // clean up stripe (best-effort)
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (subscription?.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch {
      // don't block deletion on stripe errors
    }
  }
  if (subscription?.stripeCustomerId) {
    try {
      await stripe.customers.del(subscription.stripeCustomerId);
    } catch {
      // don't block deletion on stripe errors
    }
  }

  // clean up core app user files (best-effort)
  try {
    const token = await new SignJWT({ id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1m")
      .sign(secret);

    await fetch(`${CORE_APP_URL}/api/users/me`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // don't block deletion on core app errors
  }

  // clean up verification tokens (no FK to user)
  await prisma.verificationToken.deleteMany({
    where: { identifier: { contains: session.user.email } },
  });

  // delete user (cascades accounts, sessions, subscription)
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
