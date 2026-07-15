import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function PATCH(request: Request) {
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
