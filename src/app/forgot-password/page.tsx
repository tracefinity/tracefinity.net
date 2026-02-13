"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <main className="pt-12 max-w-sm mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-4 text-sm text-text-secondary">
          If an account exists with that email, we&apos;ve sent a password reset link.
          Check your inbox and spam folder.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-accent hover:text-text-primary transition-colors"
        >
          Back to login
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-12 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter your email and we&apos;ll send a reset link.
      </p>

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

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-4 text-sm text-text-secondary">
        <Link href="/login" className="text-accent hover:text-text-primary transition-colors">
          Back to login
        </Link>
      </p>
    </main>
  );
}
