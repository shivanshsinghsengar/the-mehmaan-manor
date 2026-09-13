import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

// Default values matching schema
const DEFAULTS = {
  id: SINGLETON_ID,
  triggerLabel: "Enter the Manor Experience",
  introLine1Heading: "The Mehmaan Manor",
  introLine1Sub: "Gurugram · Haryana · India",
  introLine2Heading: "Feel like Mehmaan",
  introLine2Sub: "A home away from home.",
  exteriorLocationTag: "Gurugram · Haryana · India",
  exteriorStepLabel: "Step inside the Manor",
  exteriorImageUrl: "",
  receptionWelcome: "Namaste! Choose a gate to explore — our properties or about us.",
  receptionPlaque: "The Mehmaan Manor",
  receptionSub: "Reception Hall · Gurugram",
  aboutTitle: "Our Story",
  aboutSubtitle: "The Mehmaan Manor",
  aboutBody: "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship.",
  aboutHost1Name: "Simran",
  aboutHost1Role: "Co-founder & Host",
  aboutHost2Name: "Jyoti",
  aboutHost2Role: "Co-founder & Host",
  aboutStory1Title: "The Beginning",
  aboutStory1Body: "We couldn't find a place that felt like home. So we built one.",
  aboutStory2Title: "The Philosophy",
  aboutStory2Body: "Every detail is intentional. Every guest is family.",
  aboutStory3Title: "The Promise",
  aboutStory3Body: "Come as a guest. Leave as family.",
  exteriorPhotos: "[]",
  aboutPhotos: "[]",
  isEnabled: true,
};

export async function GET() {
  try {
    let record = await (prisma as any).manorExperience.findUnique({
      where: { id: SINGLETON_ID },
    });
    if (!record) {
      record = await (prisma as any).manorExperience.create({ data: DEFAULTS });
    }
    return NextResponse.json(record);
  } catch (err) {
    console.error("ManorExperience GET error:", err);
    // Return defaults if table doesn't exist yet (before migration)
    return NextResponse.json(DEFAULTS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id: _id, ...data } = body;

    const record = await (prisma as any).manorExperience.upsert({
      where: { id: SINGLETON_ID },
      update: data,
      create: { ...DEFAULTS, ...data, id: SINGLETON_ID },
    });
    return NextResponse.json({ success: true, record });
  } catch (err) {
    console.error("ManorExperience PUT error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
