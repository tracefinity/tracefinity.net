import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXTAUTH_URL || "https://tracefinity.net";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(`${BASE_URL}/login?verify=invalid`);
  }

  const identifier = `verify:${email}`;

  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token },
  });

  if (!record || record.expires < new Date()) {
    if (record) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
    }
    return NextResponse.redirect(`${BASE_URL}/login?verify=expired`);
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });

  return NextResponse.redirect(`${BASE_URL}/login?verified=true`);
}
