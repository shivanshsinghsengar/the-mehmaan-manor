import { NextResponse } from "next/server";
import { getStore, savePhoto, deletePhoto } from "@/lib/store";
import { unlink } from "fs/promises";
import path from "path";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const store = getStore();
  const photo = store.photos.find((p) => p.id === params.id);
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  savePhoto({ ...photo, ...body, id: params.id });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const store = getStore();
  const photo = store.photos.find((p) => p.id === params.id);
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Try to delete local file
  if (photo.url.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", photo.url);
      await unlink(filePath);
    } catch {
      // File might not exist, ignore
    }
  }

  deletePhoto(params.id);
  return NextResponse.json({ success: true });
}
