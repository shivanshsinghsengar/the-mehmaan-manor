import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(properties);
}
