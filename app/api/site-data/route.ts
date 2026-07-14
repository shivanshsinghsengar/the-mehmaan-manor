import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [properties, photos, content] = await Promise.all([
    prisma.property.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }),
    prisma.photo.findMany({ orderBy: { order: "asc" } }),
    prisma.siteContent.findUnique({ where: { id: "singleton" } }),
  ]);

  return NextResponse.json({
    properties,
    photos,
    content,
    heroPhotos: photos.filter((p) => p.section === "hero"),
    instagramPhotos: photos.filter((p) => p.section === "instagram"),
    propertyCards: {
      "1": photos.filter((p) => p.propertyId === "1" && p.section === "property-card"),
      "2": photos.filter((p) => p.propertyId === "2" && p.section === "property-card"),
    },
  });
}
