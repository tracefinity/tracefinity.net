import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const APP_URL = process.env.APP_URL || "https://app.tracefinity.net";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    const loginUrl = new URL("/login", process.env.NEXTAUTH_URL || "https://tracefinity.net");
    loginUrl.searchParams.set("callbackUrl", "/api/auth/app-token");
    return NextResponse.redirect(loginUrl);
  }

  const token = await new SignJWT({ id: session.user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const res = NextResponse.redirect(APP_URL);
  res.cookies.set("tracefinity-app-token", token, {
    domain: ".tracefinity.net",
    path: "/",
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
  });

  return res;
}
