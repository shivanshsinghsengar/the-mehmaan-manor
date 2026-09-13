import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  id: "singleton",
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
      where: { id: "singleton" },
    });
    if (!record) record = DEFAULTS;
    return NextResponse.json(record);
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}
