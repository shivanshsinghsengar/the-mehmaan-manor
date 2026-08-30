/**
 * POST /api/track
 * Lightweight page-view tracker called silently by public pages.
 * No auth required — it's a public write-only endpoint.
 * We intentionally keep it minimal to avoid slowing page loads.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { page } = await request.json();

    if (!page || typeof page !== "string" || page.length > 200) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const now = new Date();
    const date = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    await prisma.pageView.create({
      data: {
        page: page.slice(0, 200),
        date,
        createdAt: now.toISOString(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Silently fail — never break the user's page load
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
