"use client";

import { useEffect, useState } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.tracefinity.net";

interface UsageStatsProps {
  maxTraces: number;
  maxTools: number | null; // null = unlimited
}

interface UsageCounts {
  traces_this_month: number;
  tool_count: number;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function UsageStats({ maxTraces, maxTools }: UsageStatsProps) {
  const [counts, setCounts] = useState<UsageCounts | null>(null);
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
      .then((data) =>
        setCounts({
          traces_this_month: data.traces_this_month,
          tool_count: data.tool_count,
        }),
      )
      .catch(() => setError(true));
  }, []);

  const tracesLabel = maxTraces === Infinity ? "unlimited" : maxTraces;
  const toolsLabel = maxTools === null ? "unlimited" : maxTools;

  if (error) {
    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Traces this month
          </p>
          <p className="mt-2 text-sm text-text-muted">unavailable</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
          <p className="mt-2 text-sm text-text-muted">unavailable</p>
        </div>
      </>
    );
  }

  if (!counts) {
    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Traces this month
          </p>
          <p className="mt-2 text-sm text-text-muted">loading...</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
          <p className="mt-2 text-sm text-text-muted">loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Traces this month
        </p>
        <p className="mt-2 text-lg font-semibold">
          {counts.traces_this_month}{" "}
          <span className="text-sm font-normal text-text-muted">/ {tracesLabel}</span>
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Tools</p>
        <p className="mt-2 text-lg font-semibold">
          {counts.tool_count}{" "}
          <span className="text-sm font-normal text-text-muted">/ {toolsLabel}</span>
        </p>
      </div>
    </>
  );
}
