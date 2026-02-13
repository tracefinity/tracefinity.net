import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { generateToken, storeToken, sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`forgot-password:${ip}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // always return success to avoid leaking whether email exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // delete any existing reset tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { identifier: `reset:${email}` },
  });

  const token = generateToken();
  await storeToken(`reset:${email}`, token, 60 * 60 * 1000);
  await sendPasswordResetEmail(email, token);

  return NextResponse.json({ ok: true });
}
