import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
} from "@/lib/auth";

const ADMIN_SESSION_COOKIE = "mm_admin_session";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  // Determine caller IP for rate limiting
  const headerList = headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  // Rate-limit check — reject if locked out
  const rateLimitError = checkLoginRateLimit(ip);
  if (rateLimitError) return rateLimitError;

  const { username, password } = await request.json();

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  // Ensure env vars are set
  if (!validUsername || !validPassword || !sessionToken) {
    return NextResponse.json(
      { error: "Server misconfiguration — admin credentials not set." },
      { status: 500 }
    );
  }

  const usernameMatch = username === validUsername;
  const passwordMatch = password === validPassword;

  if (!usernameMatch || !passwordMatch) {
    // Record failure and apply deliberate delay
    recordFailedLogin(ip);
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Success — clear any recorded attempts and set session cookie
  clearLoginAttempts(ip);

  cookies().set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SEVEN_DAYS,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
