import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?verify=invalid", request.url));
  }

  const identifier = `verify:${email}`;

  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token },
  });

  if (!record || record.expires < new Date()) {
    // clean up expired token if it exists
    if (record) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
    }
    return NextResponse.redirect(new URL("/login?verify=expired", request.url));
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });

  return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
