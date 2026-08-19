import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "pdqt9y1o",
  api_key: process.env.CLOUDINARY_API_KEY || "659975391527599",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

      // Convert to base64 for Cloudinary upload
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const ext = file.name.split(".").pop() || "jpg";
      const alt = altPrefix || file.name.replace(`.${ext}`, "").replace(/-/g, " ");

      let url = dataUrl; // fallback

      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(dataUrl, {
          folder: "mehman-manor",
          resource_type: "image",
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        });
        url = result.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload failed, using base64 fallback:", cloudErr);
        // Keep base64 as fallback
      }

      // Get current max order
      const maxOrderRow = await prisma.photo.aggregate({
        _max: { order: true },
        where: { section, ...(propertyId ? { propertyId } : {}) },
      });
      const nextOrder = (maxOrderRow._max.order ?? -1) + 1;

      const photo = await prisma.photo.create({
        data: {
          url,
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
