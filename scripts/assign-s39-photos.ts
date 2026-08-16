import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Maps WA number → section + alt for Sector 39 (1RK) photos
const MAP: Record<string, { section: string; alt: string; isFeatured: boolean; order: number }> = {
  "WA0016": { section: "property-card", alt: "Sector 39 — cozy bedroom with double bed and mini fridge",   isFeatured: true,  order: 0 },
  "WA0017": { section: "gallery",       alt: "Sector 39 — spacious balcony with open sky view",            isFeatured: false, order: 1 },
  "WA0018": { section: "gallery",       alt: "Sector 39 — bedroom with fan, natural light and balcony",    isFeatured: false, order: 2 },
  "WA0019": { section: "hero",          alt: "The Mehmaan Manor — Sector 39 building exterior",            isFeatured: true,  order: 3 },
  "WA0020": { section: "property-hero", alt: "Sector 39 — balcony with lush green trees and city view",    isFeatured: true,  order: 4 },
  "WA0021": { section: "gallery",       alt: "Sector 39 — bathroom vanity with toiletry kit",              isFeatured: false, order: 5 },
  "WA0022": { section: "gallery",       alt: "Sector 39 — smart TV, work desk and wardrobe",               isFeatured: false, order: 6 },
  "WA0023": { section: "gallery",       alt: "Sector 39 — clean bathroom with shower and fresh towels",    isFeatured: false, order: 7 },
};

async function main() {
  // Find unassigned photos (these are the newly uploaded S39 ones)
  const unassigned = await prisma.photo.findMany({
    where: { propertyId: null },
    orderBy: { alt: "asc" },
  });

  console.log(`Found ${unassigned.length} unassigned photos\n`);

  let updated = 0;

  for (const photo of unassigned) {
    const match = photo.alt?.match(/WA(\d+)/i);
    const waNum = match ? match[0].toUpperCase() : null;
    const meta = waNum ? MAP[waNum] : null;

    if (meta) {
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          propertyId: "2",
          section: meta.section,
          isFeatured: meta.isFeatured,
          alt: meta.alt,
          order: meta.order,
          tags: ["sector-39", "jharsa-village", "1rk", meta.section],
        },
      });
      console.log(`✓ [${photo.id}] ${waNum} → ${meta.section}  "${meta.alt.substring(0, 55)}"`);
      updated++;
    } else {
      // Fallback — assign to Sector 39 gallery
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          propertyId: "2",
          section: "gallery",
          tags: ["sector-39", "jharsa-village", "gallery"],
        },
      });
      console.log(`~ [${photo.id}] (no map) → gallery  "${photo.alt}"`);
      updated++;
    }
  }

  console.log(`\n✅ Done! ${updated} photos assigned to Sector 39 (1RK).`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
