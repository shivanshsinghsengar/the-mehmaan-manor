import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "mm_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin UI routes — API routes handle their own auth via requireAdmin()
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page through without a session check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for valid session cookie on all other /admin/* pages
  const session = request.cookies.get(ADMIN_SESSION_COOKIE);

  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
