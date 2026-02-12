"use client";

import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center rounded-full bg-elevated border border-white/6 px-5 py-2 text-sm font-medium text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors disabled:opacity-50"
    >
      {loading ? "Loading..." : "Manage billing"}
    </button>
  );
}
