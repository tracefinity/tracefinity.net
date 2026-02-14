"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "true";
  const verified = searchParams.get("verified") === "true";
  const reset = searchParams.get("reset") === "true";
  const deleted = searchParams.get("deleted") === "true";
  const verifyStatus = searchParams.get("verify");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    // full navigation handles both pages and api routes
    window.location.href = callbackUrl;
  }

  return (
    <main className="pt-12 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-text-secondary">
        No account?{" "}
        <Link href="/signup" className="text-accent hover:text-text-primary transition-colors">
          Sign up
        </Link>
      </p>

      {deleted && (
        <p className="mt-4 text-sm text-text-muted">
          Your account has been deleted.
        </p>
      )}

      {registered && (
        <p className="mt-4 text-sm text-green-400">
          Account created. Check your email to verify, then log in.
        </p>
      )}

      {verified && (
        <p className="mt-4 text-sm text-green-400">
          Email verified. Log in to continue.
        </p>
      )}

      {reset && (
        <p className="mt-4 text-sm text-green-400">
          Password reset. Log in with your new password.
        </p>
      )}

      {verifyStatus === "expired" && (
        <p className="mt-4 text-sm text-red-400">
          Verification link expired. Log in and resend from the dashboard.
        </p>
      )}

      {verifyStatus === "invalid" && (
        <p className="mt-4 text-sm text-red-400">
          Invalid verification link.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-text-secondary mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="text-sm text-text-secondary">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-accent hover:text-text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
