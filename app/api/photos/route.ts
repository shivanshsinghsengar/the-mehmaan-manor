import { NextResponse } from "next/server";
import { getPhotos, savePhoto, type SitePhoto } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId") ?? undefined;
  const section = searchParams.get("section") ?? undefined;
  return NextResponse.json(getPhotos(propertyId, section));
}

export async function POST(request: Request) {
  const body = await request.json() as SitePhoto;
  if (!body.id || !body.url) {
    return NextResponse.json({ error: "id and url required" }, { status: 400 });
  }
  savePhoto(body);
  return NextResponse.json({ success: true, photo: body });
}
