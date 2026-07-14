import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  // Remove fields that shouldn't be overwritten
  const { id: _id, ...data } = body;

  const property = await prisma.property.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, property });
}
