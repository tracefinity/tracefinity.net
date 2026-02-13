import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.de", "tempmail.com",
  "throwaway.email", "yopmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "trashmail.com", "10minutemail.com",
  "mailnesia.com", "tempail.com", "tempr.email", "discard.email",
]);

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashed,
        subscription: {
          create: { tier: "FREE" },
        },
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
