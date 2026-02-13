import { Resend } from "resend";
import crypto from "crypto";
import { prisma } from "./db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Tracefinity <noreply@tracefinity.net>";
const BASE_URL = process.env.NEXTAUTH_URL || "https://tracefinity.net";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// clean up expired tokens, then insert new one
export async function storeToken(identifier: string, token: string, expiresIn: number) {
  await prisma.verificationToken.deleteMany({
    where: { expires: { lt: new Date() } },
  });
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires: new Date(Date.now() + expiresIn),
    },
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your email - Tracefinity",
    html: `
      <p>Click the link below to verify your email address:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create a Tracefinity account, you can ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your password - Tracefinity",
    html: `
      <p>Click the link below to reset your password:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
  });
}
