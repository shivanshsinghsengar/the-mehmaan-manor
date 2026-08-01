import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, slug, address, coordinates, description, vibe, baseRate, weekendRate, cleaningFee, maxGuests, checkInTime, checkOutTime, amenities, policies } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  // Generate next ID
  const existing = await prisma.property.findMany({ select: { id: true } });
  const nextId = String(existing.length + 1);

  const property = await prisma.property.create({
    data: {
      id: nextId,
      name,
      slug,
      address: address || "",
      coordinates: coordinates || "",
      description: description || "",
      vibe: vibe || "",
      baseRate: Number(baseRate) || 3500,
      weekendRate: Number(weekendRate) || 4500,
      cleaningFee: Number(cleaningFee) || 500,
      maxGuests: Number(maxGuests) || 4,
      checkInTime: checkInTime || "14:00",
      checkOutTime: checkOutTime || "11:00",
      amenities: amenities || [],
      policies: policies || "No smoking indoors. Quiet hours 10 PM – 8 AM.",
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, property });
}
