import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  const json = JSON.stringify(bookings, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mehmaan-manor-bookings-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
