import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { savePhoto, getStore, type SitePhoto } from "@/lib/store";

export const runtime = "nodejs";

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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const saved: SitePhoto[] = [];

    for (const file of files) {
      if (!file.size) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const filePath = path.join(uploadDir, safeName);

      await writeFile(filePath, buffer);

      const store = getStore();
      const maxOrder =
        store.photos.length > 0
          ? Math.max(...store.photos.map((p) => p.order)) + 1
          : 0;

      const photo: SitePhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: `/uploads/${safeName}`,
        alt: altPrefix || file.name.replace(ext, "").replace(/-/g, " "),
        propertyId: propertyId || null,
        section,
        order: maxOrder,
        isFeatured: false,
        tags: propertyId ? [`property-${propertyId}`] : [],
        uploadedAt: new Date().toISOString(),
      };

      savePhoto(photo);
      saved.push(photo);
    }

    return NextResponse.json({ success: true, photos: saved });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
