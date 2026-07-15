import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  const section = searchParams.get("section");

  const photos = await prisma.photo.findMany({
    where: {
      ...(propertyId ? { propertyId } : {}),
      ...(section ? { section } : {}),
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const photo = await prisma.photo.create({
    data: {
      url: body.url,
      alt: body.alt || "",
      propertyId: body.propertyId || null,
      section: body.section || "gallery",
      order: body.order ?? 0,
      isFeatured: body.isFeatured ?? false,
      tags: body.tags || [],
      uploadedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true, photo });
}
