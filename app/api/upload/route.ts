import { NextResponse } from "next/server";
import { savePhoto, getStore, type SitePhoto } from "@/lib/store";

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

    const saved: SitePhoto[] = [];

    for (const file of files) {
      if (!file.size) continue;

      // On Vercel: convert to base64 data URL (no filesystem needed)
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const store = getStore();
      const maxOrder =
        store.photos.length > 0
          ? Math.max(...store.photos.map((p) => p.order)) + 1
          : 0;

      const ext = file.name.split(".").pop() || "jpg";
      const alt = altPrefix || file.name.replace(`.${ext}`, "").replace(/-/g, " ");

      const photo: SitePhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: dataUrl,
        alt,
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
