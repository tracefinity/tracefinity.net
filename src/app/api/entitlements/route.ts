import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { syncSubscription } from "@/lib/sync-subscription";
import { PLAN_LIMITS, type PlanTier } from "@/lib/plans";
import { rateLimit } from "@/lib/rate-limit";

// returns the current user's plan tier and limits.
// syncs with stripe so the core app always gets fresh data.
export async function GET() {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed } = rateLimit(`entitlements:${ip}`, 30, 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const sub = await syncSubscription(session.user.id);

  const tier = (sub?.tier ?? "FREE") as PlanTier;
  const limits = PLAN_LIMITS[tier];

  return NextResponse.json({
    userId: session.user.id,
    tier,
    maxTraces: limits.maxTraces,
    maxTools: limits.maxTools,
    status: sub?.status ?? "active",
  });
}
