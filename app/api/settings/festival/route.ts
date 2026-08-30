import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public — used by the public site to display discount banners
export async function GET() {
  const content = await prisma.siteContent.findUnique({
    where: { id: "singleton" },
  });
  return NextResponse.json({
    discountPercent: content?.discountPercent ?? 0,
    activeFestival: content?.activeFestival ?? "",
    discountActive: content?.discountActive ?? false,
  });
}

// Admin only — managing festival discounts
export async function PUT(request: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { discountPercent, activeFestival, discountActive } = body;

  if (
    typeof discountPercent !== "number" ||
    typeof activeFestival !== "string" ||
    typeof discountActive !== "boolean"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: { discountPercent, activeFestival, discountActive },
    create: {
      id: "singleton",
      heroHeadline: "The Mehmaan Experience",
      heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText: "Mehmaan — the Hindi word for guest.",
      discountPercent,
      activeFestival,
      discountActive,
    },
  });

  return NextResponse.json({ success: true });
}
