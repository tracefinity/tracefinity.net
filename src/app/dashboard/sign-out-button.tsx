"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg bg-elevated px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-border-subtle transition-colors"
    >
      Sign out
    </button>
  );
}
