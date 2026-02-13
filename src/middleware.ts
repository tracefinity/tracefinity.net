import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { SignJWT } from "jose";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export default auth(async (req) => {
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !req.auth?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = NextResponse.next();

  // set app token cookie for core app at app.tracefinity.net
  if (req.auth?.user?.id) {
    const token = await new SignJWT({ id: req.auth.user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    res.cookies.set("tracefinity-app-token", token, {
      domain: ".tracefinity.net",
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });
  }

  return res;
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
