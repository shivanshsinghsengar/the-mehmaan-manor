import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { id: _id, ...data } = body;

  const photo = await prisma.photo.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, photo });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.photo.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
