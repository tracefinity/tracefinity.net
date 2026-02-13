import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`reset-password:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const { email, token, password } = await request.json();
  if (!email || !token || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const identifier = `reset:${email}`;
  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token },
  });

  if (!record || record.expires < new Date()) {
    if (record) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
    }
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });

  return NextResponse.json({ ok: true });
}
