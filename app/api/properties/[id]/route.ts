import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Public — individual property detail used by the public site
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

// Admin only — updating a property
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { id: _id, ...data } = body;

  const property = await prisma.property.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, property });
}
