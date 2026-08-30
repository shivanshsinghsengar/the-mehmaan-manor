/**
 * Auth utilities for admin API routes.
 *
 * Usage in any route handler:
 *   const auth = requireAdmin();
 *   if (!auth.ok) return auth.response;
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "mm_admin_session";

// ---------------------------------------------------------------------------
// Session check
// ---------------------------------------------------------------------------
export function requireAdmin():
  | { ok: true }
  | { ok: false; response: NextResponse } {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  const validToken = process.env.ADMIN_SESSION_TOKEN;

  if (!validToken) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Server misconfiguration — session token not set." },
        { status: 500 }
      ),
    };
  }

  if (!session || session.value !== validToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// In-memory rate limiter for login (resets on server restart — sufficient
// for a single-instance deployment; swap for Redis/Upstash on multi-instance)
// ---------------------------------------------------------------------------
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;          // max failed attempts before lockout
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout after exceeding limit

/** Returns an error response if the IP is rate-limited, otherwise null. */
export function checkLoginRateLimit(
  ip: string
): NextResponse | null {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record) {
    // Check if currently locked out
    if (record.lockedUntil && now < record.lockedUntil) {
      const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    // Reset window if it has expired
    if (now - record.firstAttempt > WINDOW_MS) {
      loginAttempts.delete(ip);
    }
  }

  return null;
}

/** Records a failed login attempt for an IP. */
export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }

  loginAttempts.set(ip, record);
}

/** Clears the attempt record on successful login. */
export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}
