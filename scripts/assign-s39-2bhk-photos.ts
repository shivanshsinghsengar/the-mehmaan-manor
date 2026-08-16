import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Smart section mapping based on WA number ranges for 2BHK photos
// First photo = property-card thumbnail, last few = gallery
// Based on typical upload order: exterior first, then interiors
const SECTION_MAP: Record<string, { section: string; alt: string; isFeatured: boolean }> = {
  "WA0024":   { section: "property-card", alt: "Sector 39 2BHK — master bedroom with double bed",        isFeatured: true  },
  "WA0025":   { section: "property-hero", alt: "Sector 39 2BHK — spacious living area",                   isFeatured: true  },
  "WA0026":   { section: "gallery",       alt: "Sector 39 2BHK — bedroom interior",                       isFeatured: false },
  "WA0027":   { section: "gallery",       alt: "Sector 39 2BHK — second bedroom",                         isFeatured: false },
  "WA0028":   { section: "gallery",       alt: "Sector 39 2BHK — kitchen area",                           isFeatured: false },
  "WA0029":   { section: "gallery",       alt: "Sector 39 2BHK — dining and living space",                isFeatured: false },
  "WA0030":   { section: "gallery",       alt: "Sector 39 2BHK — bathroom",                               isFeatured: false },
  "WA0031":   { section: "gallery",       alt: "Sector 39 2BHK — balcony view",                           isFeatured: false },
  "WA0032":   { section: "gallery",       alt: "Sector 39 2BHK — room detail",                            isFeatured: false },
  "WA0033":   { section: "gallery",       alt: "Sector 39 2BHK — interior detail",                        isFeatured: false },
  "WA0036":   { section: "gallery",       alt: "Sector 39 2BHK — bedroom corner",                         isFeatured: false },
  "WA0037":   { section: "gallery",       alt: "Sector 39 2BHK — wardrobe and storage",                   isFeatured: false },
  "WA0048":   { section: "gallery",       alt: "Sector 39 2BHK — living room seating",                    isFeatured: false },
  "WA0049":   { section: "gallery",       alt: "Sector 39 2BHK — kitchen amenities",                      isFeatured: false },
  "WA0050":   { section: "gallery",       alt: "Sector 39 2BHK — bathroom fittings",                      isFeatured: false },
  "WA0051":   { section: "gallery",       alt: "Sector 39 2BHK — natural light and ventilation",          isFeatured: false },
  "WA0052":   { section: "gallery",       alt: "Sector 39 2BHK — cozy corner",                            isFeatured: false },
  "WA0053":   { section: "gallery",       alt: "Sector 39 2BHK — smart TV and entertainment",             isFeatured: false },
  "WA0054":   { section: "gallery",       alt: "Sector 39 2BHK — workspace setup",                        isFeatured: false },
  "WA0055":   { section: "instagram",     alt: "Sector 39 2BHK — lifestyle shot",                         isFeatured: false },
  "WA0056":   { section: "gallery",       alt: "Sector 39 2BHK — property detail",                        isFeatured: false },
  "WA0057":   { section: "gallery",       alt: "Sector 39 2BHK — exterior view",                          isFeatured: false },
};

async function main() {
  const unassigned = await prisma.photo.findMany({
    where: { propertyId: null },
    orderBy: { alt: "asc" },
  });

  console.log(`Found ${unassigned.length} unassigned photos\n`);

  let updated = 0;

  for (let i = 0; i < unassigned.length; i++) {
    const photo = unassigned[i];
    
    // Extract WA number (handle duplicates like WA0024(1))
    const match = photo.alt?.match(/WA(\d+)/i);
    const waNum = match ? `WA${match[1]}` : null;
    const meta = waNum ? SECTION_MAP[waNum] : null;

    // For duplicates (same WA number), assign to gallery
    const isDuplicate = photo.alt?.includes("(1)") || photo.alt?.includes("(2)");

    await prisma.photo.update({
      where: { id: photo.id },
      data: {
        propertyId: "2",
        section: isDuplicate ? "gallery" : (meta?.section ?? "gallery"),
        isFeatured: isDuplicate ? false : (meta?.isFeatured ?? false),
        alt: isDuplicate 
          ? `Sector 39 2BHK — photo ${i + 1}` 
          : (meta?.alt ?? `Sector 39 2BHK — photo ${i + 1}`),
        order: 10 + i,
        tags: ["sector-39", "jharsa-village", "2bhk", isDuplicate ? "gallery" : (meta?.section ?? "gallery")],
      },
    });

    const label = isDuplicate ? "gallery (duplicate)" : (meta?.section ?? "gallery");
    console.log(`✓ [${photo.id}] ${photo.alt} → ${label}`);
    updated++;
  }

  console.log(`\n✅ Done! ${updated} 2BHK photos assigned to Sector 39.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
