"use client";

import { useEffect, useState } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.tracefinity.net";

interface Usage {
  traces_this_month: number;
  tool_count: number;
  max_traces: number | null;
  max_tools: number | null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function UsageStats() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = getCookie("tracefinity-app-token");
    if (!token) {
      setError(true);
      return;
    }

    fetch(`${APP_URL}/api/usage`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUsage)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Traces</p>
          <p className="mt-2 text-sm text-text-muted">unavailable</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
          <p className="mt-2 text-sm text-text-muted">unavailable</p>
        </div>
      </>
    );
  }

  if (!usage) {
    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Traces</p>
          <p className="mt-2 text-sm text-text-muted">loading...</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
          <p className="mt-2 text-sm text-text-muted">loading...</p>
        </div>
      </>
    );
  }

  const tracesMax = usage.max_traces === null ? "unlimited" : usage.max_traces;
  const toolsMax = usage.max_tools === null ? "unlimited" : usage.max_tools;

  return (
    <>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Traces this month
        </p>
        <p className="mt-2 text-lg font-semibold">
          {usage.traces_this_month}{" "}
          <span className="text-sm font-normal text-text-muted">/ {tracesMax}</span>
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
        <p className="mt-2 text-lg font-semibold">
          {usage.tool_count}{" "}
          <span className="text-sm font-normal text-text-muted">/ {toolsMax}</span>
        </p>
      </div>
    </>
  );
}
