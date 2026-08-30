import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ inquiries });
}

export async function PATCH(request: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const { id, status } = await request.json();
  const updated = await prisma.inquiry.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ inquiry: updated });
}
