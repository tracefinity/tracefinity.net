"use client";

import { useState } from "react";

export function DeleteAccountSection({ email }: { email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const matches = typed === email;

  async function handleDelete() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmEmail: typed }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    window.location.href = "/login?deleted=true";
  }

  if (!confirming) {
    return (
      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-red-400">Delete account</h2>
        <p className="mt-1 text-xs text-text-muted">
          Permanently delete your account, subscription, and all stored data.
          This cannot be undone.
        </p>
        <button
          onClick={() => setConfirming(true)}
          className="mt-3 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Delete account
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-sm font-semibold text-red-400">Delete account</h2>
      <p className="mt-1 text-xs text-text-muted">
        Type <span className="font-mono text-text-secondary">{email}</span> to confirm.
      </p>
      <input
        type="email"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="your@email.com"
        className="mt-3 w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-red-500 focus:outline-none"
        autoComplete="off"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex gap-3">
        <button
          onClick={handleDelete}
          disabled={!matches || loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting..." : "Permanently delete"}
        </button>
        <button
          onClick={() => {
            setConfirming(false);
            setTyped("");
            setError("");
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
