/**
 * Single endpoint that returns everything the public site needs.
 * Public pages call this to get live content without touching code.
 */
import { NextResponse } from "next/server";
import { getProperties, getPhotos, getContent } from "@/lib/store";

export async function GET() {
  const properties = getProperties();
  const photos = getPhotos();
  const content = getContent();

  return NextResponse.json({
    properties,
    photos,
    content,
    // Pre-group photos for easy consumption
    heroPhotos: photos.filter((p) => p.section === "hero"),
    instagramPhotos: photos.filter((p) => p.section === "instagram"),
    propertyCards: {
      "1": photos.filter((p) => p.propertyId === "1" && p.section === "property-card"),
      "2": photos.filter((p) => p.propertyId === "2" && p.section === "property-card"),
    },
  });
}
