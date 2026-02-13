// sliding window rate limiter (in-memory, per-process)

const hits = new Map<string, number[]>();

// login lockout tracking
const loginFailures = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
const MAX_WINDOW = 60 * 60 * 1000; // 1 hour

setInterval(() => {
  const cutoff = Date.now() - MAX_WINDOW;
  for (const [key, timestamps] of hits) {
    const filtered = timestamps.filter((t) => t > cutoff);
    if (filtered.length === 0) hits.delete(key);
    else hits.set(key, filtered);
  }
  for (const [key, timestamps] of loginFailures) {
    const filtered = timestamps.filter((t) => t > cutoff);
    if (filtered.length === 0) loginFailures.delete(key);
    else loginFailures.set(key, filtered);
  }
}, CLEANUP_INTERVAL);

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length };
}

// login lockout: 5 failures in 15 minutes

const LOGIN_LOCKOUT_LIMIT = 5;
const LOGIN_LOCKOUT_WINDOW = 15 * 60 * 1000;

export function checkLoginLocked(email: string): boolean {
  const now = Date.now();
  const cutoff = now - LOGIN_LOCKOUT_WINDOW;
  const failures = (loginFailures.get(email) ?? []).filter((t) => t > cutoff);
  loginFailures.set(email, failures);
  return failures.length >= LOGIN_LOCKOUT_LIMIT;
}

export function recordLoginFailure(email: string): void {
  const now = Date.now();
  const cutoff = now - LOGIN_LOCKOUT_WINDOW;
  const failures = (loginFailures.get(email) ?? []).filter((t) => t > cutoff);
  failures.push(now);
  loginFailures.set(email, failures);
}

export function clearLoginFailures(email: string): void {
  loginFailures.delete(email);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
