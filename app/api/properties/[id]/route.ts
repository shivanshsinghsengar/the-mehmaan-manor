import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Normalize legacy visitor hours in policy text
function normalizePolicy(policy: string): string {
  return policy
    .replace(/Visitors allowed 10:00 AM\s*[-–]\s*8:00 PM/g, "Visitors allowed 2:00 PM – 8:00 PM")
    .replace(/Visitors allowed 10:00AM\s*[-–]\s*8:00PM/g, "Visitors allowed 2:00 PM – 8:00 PM")
    .replace(/\(10AM[-–]8PM\)/g, "(2PM–8PM)");
}

// Public — individual property detail used by the public site
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...property, policies: normalizePolicy(property.policies) });
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
