import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/availability?propertyId=1&checkIn=2026-09-01&checkOut=2026-09-03
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!propertyId || !checkIn || !checkOut) {
    return NextResponse.json({ error: "propertyId, checkIn, checkOut required" }, { status: 400 });
  }

  // Check for confirmed bookings that overlap with the requested dates.
  // Overlap condition: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
  const overlapping = await prisma.booking.findFirst({
    where: {
      propertyId: String(propertyId),
      status: { in: ["CONFIRMED", "PENDING_PAYMENT"] },
      checkIn: { lt: checkOut },   // existing starts before requested ends
      checkOut: { gt: checkIn },   // existing ends after requested starts
    },
  });

  // Also check property's blockedDates array
  const property = await prisma.property.findUnique({
    where: { id: String(propertyId) },
    select: { blockedDates: true },
  });

  const blockedDates = property?.blockedDates ?? [];

  // Check if any date in range falls in blockedDates
  let isBlocked = false;
  if (blockedDates.length > 0) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      if (blockedDates.includes(dateStr)) {
        isBlocked = true;
        break;
      }
    }
  }

  const available = !overlapping && !isBlocked;

  return NextResponse.json({ available, soldOut: !available });
}
