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
  return NextResponse.json({ bookings });
}

export async function PATCH(request: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const { id, status, note } = await request.json();

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(note
        ? {
            specialRequests: existing.specialRequests
              ? `${existing.specialRequests}\n---\n${note}`
              : note,
          }
        : {}),
    },
  });

  return NextResponse.json({ booking: updated });
}
