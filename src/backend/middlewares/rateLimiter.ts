import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Module-level store — persists for the lifetime of the Node.js process.
// Keyed by "<ip>:<pathname>" so each route has its own independent counter.
const store = new Map<string, RateLimitEntry>();

// Sweep stale entries every 5 minutes so the Map does not grow without bound.
// The global guard prevents duplicate intervals when Next.js re-evaluates this
// module during HMR or in concurrent worker contexts.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const g = global as typeof global & { __rateLimiterSweep?: ReturnType<typeof setInterval> };
if (!g.__rateLimiterSweep) {
  g.__rateLimiterSweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      // Entries are stale once their window has passed and no new request
      // has reset them. Use the longest reasonable window (1 hour) as the
      // eviction threshold so we never evict an actively-used entry.
      if (now - entry.windowStart >= 60 * 60 * 1000) {
        store.delete(key);
      }
    }
  }, SWEEP_INTERVAL_MS);
  // Don't prevent the process from exiting cleanly
  g.__rateLimiterSweep.unref?.();
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window. Default: 60 */
  limit?: number;
  /** Window duration in milliseconds. Default: 60 000 (1 minute) */
  windowMs?: number;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * IP-based fixed-window rate limiter.
 *
 * Returns `null` when the request is within the allowed limit.
 * Returns a `NextResponse` (429) when the limit is exceeded — callers
 * should return this response immediately, just like `authMiddleware`.
 *
 * @example
 * export async function POST(req: NextRequest) {
 *   const limited = rateLimiter(req, { limit: 10, windowMs: 60_000 });
 *   if (limited) return limited;
 *   // ... handler logic
 * }
 */
export const rateLimiter = (
  req: NextRequest,
  { limit = 60, windowMs = 60_000 }: RateLimitOptions = {},
): NextResponse | null => {
  const ip = getClientIp(req);
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    // Previous window expired — start a fresh one (re-use existing entry slot
    // to avoid churn, but the old window data is gone so this is effectively
    // a new entry).
    store.set(key, { count: 1, windowStart: now });
    return null;
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        data: null,
        statusCode: 429,
        message: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return null;
};
