import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const result = await prisma.booking.deleteMany({});
  return NextResponse.json({ success: true, deleted: result.count });
}
