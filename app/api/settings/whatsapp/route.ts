import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_PHONE = "918828352311";

export async function GET() {
  const content = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
  const phone = content?.teamSimranPhone
    ? `91${content.teamSimranPhone.replace(/\D/g, "")}`
    : DEFAULT_PHONE;
  return NextResponse.json({ phone });
}

export async function PUT(request: Request) {
  const { phone } = await request.json();
  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }
  const cleaned = phone.replace(/\D/g, "").replace(/^91/, "");
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: { teamSimranPhone: cleaned },
    create: {
      id: "singleton",
      heroHeadline: "The Mehmaan Experience",
      heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText: "Mehmaan — the Hindi word for guest.",
      teamSimranPhone: cleaned,
    },
  });
  return NextResponse.json({ success: true, phone: `91${cleaned}` });
}
