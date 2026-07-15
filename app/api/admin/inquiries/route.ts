import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ inquiries });
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  const updated = await prisma.inquiry.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ inquiry: updated });
}
