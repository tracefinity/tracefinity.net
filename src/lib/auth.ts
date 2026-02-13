import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { authConfig } from "./auth.config";
import { checkLoginLocked, recordLoginFailure, clearLoginFailures } from "./rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;

        if (checkLoginLocked(email)) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password) {
          recordLoginFailure(email);
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) {
          recordLoginFailure(email);
          return null;
        }

        clearLoginFailures(email);
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
});
