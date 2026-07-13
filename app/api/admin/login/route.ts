import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "mm_admin_session";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
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

  // Constant-time comparison to prevent timing attacks
  const usernameMatch = username === validUsername;
  const passwordMatch = password === validPassword;

  if (!usernameMatch || !passwordMatch) {
    // Deliberate delay to slow brute-force attempts
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Set secure session cookie
  cookies().set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SEVEN_DAYS,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
