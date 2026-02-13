"use client";

import { useState } from "react";

export function VerifyBanner() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("sending");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 429) {
        setStatus("error");
        return;
      }
      // already verified or other issue
      if (data.error === "Already verified.") {
        window.location.reload();
        return;
      }
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
      <p>
        Please verify your email address. Check your inbox for a verification link.
      </p>
      <div className="mt-2">
        {status === "idle" && (
          <button
            onClick={handleResend}
            className="text-yellow-300 underline hover:text-yellow-100 transition-colors"
          >
            Resend verification email
          </button>
        )}
        {status === "sending" && <span className="text-yellow-300">Sending...</span>}
        {status === "sent" && <span className="text-green-400">Verification email sent.</span>}
        {status === "error" && (
          <span className="text-red-400">Could not send. Try again later.</span>
        )}
      </div>
    </div>
  );
}
