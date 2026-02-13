import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`nextauth:${ip}`, 10, 5 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  return handlers.POST(request);
}
