import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const result = await prisma.booking.deleteMany({});
  return NextResponse.json({ success: true, deleted: result.count });
}
