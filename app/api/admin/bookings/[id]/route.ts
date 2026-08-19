import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
