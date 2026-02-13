import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { generateToken, storeToken, sendVerificationEmail } from "@/lib/email";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { allowed } = rateLimit(`resend-verify:${session.user.id}`, 2, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.emailVerified) {
    return NextResponse.json({ error: "Already verified." }, { status: 400 });
  }

  // delete any existing verification tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { identifier: `verify:${user.email}` },
  });

  const token = generateToken();
  await storeToken(`verify:${user.email}`, token, 24 * 60 * 60 * 1000);
  await sendVerificationEmail(user.email, token);

  return NextResponse.json({ ok: true });
}
