import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Admin only — partial update (e.g. reorder, toggle featured)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const photo = await prisma.photo.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json({ success: true, photo });
}

// Admin only — full update
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { id: _id, ...data } = body;

  const photo = await prisma.photo.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, photo });
}

// Admin only — delete a photo
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.photo.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
