import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const propertyId = formData.get("propertyId") as string | null;
    const section = (formData.get("section") as string) || "gallery";
    const altPrefix = (formData.get("altPrefix") as string) || "";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const saved = [];

    for (const file of files) {
      if (!file.size) continue;

      // Convert to base64 data URL (works on Vercel serverless — no filesystem)
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const ext = file.name.split(".").pop() || "jpg";
      const alt = altPrefix || file.name.replace(`.${ext}`, "").replace(/-/g, " ");

      // Get current max order for this section
      const maxOrderRow = await prisma.photo.aggregate({
        _max: { order: true },
        where: { section, ...(propertyId ? { propertyId } : {}) },
      });
      const nextOrder = (maxOrderRow._max.order ?? -1) + 1;

      const photo = await prisma.photo.create({
        data: {
          url: dataUrl,
          alt,
          propertyId: propertyId || null,
          section,
          order: nextOrder,
          isFeatured: false,
          tags: propertyId ? [`property-${propertyId}`] : [],
          uploadedAt: new Date().toISOString(),
        },
      });

      saved.push(photo);
    }

    return NextResponse.json({ success: true, photos: saved });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
