/**
 * Assigns existing Sector 57 photos to correct sections.
 * Run: npx tsx scripts/assign-s57-photos.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Fetch all photos that look like they're the S57 batch
  const photos = await prisma.photo.findMany({
    where: {
      alt: { contains: "WA0" },
    },
    orderBy: { alt: "asc" },
  });

  console.log(`Found ${photos.length} WhatsApp photos to assign\n`);

  // Map: based on order (WA0001, WA0002, etc.) assign sections
  // First photo → hero, second → property-hero, third → property-card, rest → gallery
  // Also set propertyId = "1" for all (Sector 57)
  const sectionMap: Record<string, { section: string; isFeatured: boolean; alt: string }> = {
    "WA0001": { section: "hero",          isFeatured: true,  alt: "The Mehmaan Manor — Sector 57 exterior" },
    "WA0002": { section: "property-hero", isFeatured: true,  alt: "Sector 57 — reception lobby wide view" },
    "WA0003": { section: "property-card", isFeatured: true,  alt: "Sector 57 — bedroom with king bed and city view" },
    "WA0005": { section: "gallery",       isFeatured: false, alt: "Sector 57 — bedroom workspace and TV wall" },
    "WA0006": { section: "gallery",       isFeatured: false, alt: "Sector 57 — bedroom balcony and desk" },
    "WA0007": { section: "gallery",       isFeatured: false, alt: "Sector 57 — mini kitchen shelf with amenities" },
    "WA0010": { section: "gallery",       isFeatured: false, alt: "Sector 57 — bathroom with LED mirror and marble" },
    "WA0012": { section: "gallery",       isFeatured: false, alt: "Sector 57 — bathroom full view" },
    "WA0013": { section: "gallery",       isFeatured: false, alt: "Sector 57 — balcony with green view" },
    "WA0014": { section: "instagram",     isFeatured: false, alt: "Sector 57 — co-working lounge" },
    "WA0015": { section: "gallery",       isFeatured: false, alt: "Sector 57 — corridor and elevator" },
  };

  let updated = 0;
  let order = 0;

  for (const photo of photos) {
    // Extract WA number from alt text like "IMG 20260813 WA0001"
    const match = photo.alt?.match(/WA(\d+)/i);
    const waNum = match ? match[0].toUpperCase() : null;
    const meta = waNum ? sectionMap[waNum] : null;

    if (meta) {
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          propertyId: "1",
          section: meta.section,
          isFeatured: meta.isFeatured,
          alt: meta.alt,
          order: order++,
          tags: ["sector-57", "sushant-lok", meta.section],
        },
      });
      console.log(`✓ [${photo.id}] ${waNum} → section=${meta.section}  "${meta.alt.substring(0, 50)}"`);
      updated++;
    } else {
      // Fallback: assign to gallery, propertyId=1
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          propertyId: "1",
          section: "gallery",
          order: order++,
          tags: ["sector-57", "sushant-lok", "gallery"],
        },
      });
      console.log(`~ [${photo.id}] (no map) → gallery  "${photo.alt}"`);
      updated++;
    }
  }

  console.log(`\n✅ Done! ${updated} photos assigned to Sector 57.`);
  console.log("   → Now visible at /homes/sushant-lok and /gallery on the live site.\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
