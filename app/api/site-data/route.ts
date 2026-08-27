import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [properties, photos, content] = await Promise.all([
    prisma.property.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }),
    prisma.photo.findMany({ orderBy: { order: "asc" } }),
    prisma.siteContent.findUnique({ where: { id: "singleton" } }),
  ]);

  // Build propertyCards dynamically for any number of properties
  const propertyCards: Record<string, typeof photos> = {};
  for (const property of properties) {
    propertyCards[property.id] = photos.filter(
      (p) => p.propertyId === property.id && p.section === "property-card"
    );
  }

  return NextResponse.json({
    properties,
    photos,
    content,
    heroPhotos: photos.filter((p) => p.section === "hero"),
    instagramPhotos: photos.filter((p) => p.section === "instagram"),
    galleryPhotos: photos.filter((p) => p.section === "gallery"),
    propertyCards,
  });
}
