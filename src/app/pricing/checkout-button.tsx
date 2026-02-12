"use client";

import { useState } from "react";
import type { PriceKey } from "@/lib/stripe";

export function CheckoutButton({
  priceKey,
  label,
  featured,
}: {
  priceKey: PriceKey;
  label: string;
  featured: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });
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
      className={`block w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors disabled:opacity-50 ${
        featured
          ? "bg-accent text-white hover:bg-accent-hover"
          : "bg-elevated text-text-secondary hover:text-text-primary hover:bg-border-subtle"
      }`}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
