import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = {
  id: "singleton",
  heroHeadline: "The Mehmaan Experience",
  heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
  philosophyText: "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures.",
  taglinePrimary: "Not just a stay — it's the Mehmaan experience.",
  taglineSecondary: "Two homes. One promise. Endless memories.",
  taglineCloser: "Come as a guest, leave as family.",
  instagramHandle: "@themehmaanmanor",
  teamSimranPhone: "8828352311",
  teamVipinPhone: "8796568003",
  teamJyotiPhone: "8796568002",
};

export async function GET() {
  const content = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(content ?? DEFAULT_CONTENT);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id: _id, ...data } = body;

  const content = await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: data,
    create: { ...DEFAULT_CONTENT, ...data },
  });
  return NextResponse.json({ success: true, content });
}
