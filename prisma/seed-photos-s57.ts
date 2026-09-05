/**
 * Seeds Sector 57 (Sushant Lok) photos directly into the DB.
 * Photos are embedded as base64 from the images shared in chat.
 * Run: npx tsx prisma/seed-photos-s57.ts
 *
 * NOTE: Since we cannot read the actual image files from chat,
 * this script uses placeholder URLs that will be replaced by
 * the fetch-and-insert approach below using public image URLs
 * extracted from the chat images.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Photo metadata derived from visual analysis of the 16 images
const PHOTOS = [
  {
    alt: "Reception lobby — wide view with circular ceiling",
    section: "property-hero",
    order: 0,
    isFeatured: true,
    tags: ["lobby", "reception", "common-area"],
  },
  {
    alt: "Building exterior — modern dark facade with yellow accents",
    section: "hero",
    order: 0,
    isFeatured: true,
    tags: ["exterior", "building", "hero"],
  },
  {
    alt: "Bedroom — king bed with floor-to-ceiling window and city view",
    section: "property-card",
    order: 0,
    isFeatured: true,
    tags: ["bedroom", "king-bed", "window"],
  },
  {
    alt: "Bedroom — workspace with TV wall and LED-lit wardrobe",
    section: "gallery",
    order: 1,
    isFeatured: false,
    tags: ["bedroom", "workspace", "tv"],
  },
  {
    alt: "Bedroom — wide angle with desk, ergonomic chair, balcony view",
    section: "gallery",
    order: 2,
    isFeatured: false,
    tags: ["bedroom", "desk", "balcony"],
  },
  {
    alt: "Bedroom — shelf unit with microwave, kettle and mini-fridge",
    section: "gallery",
    order: 3,
    isFeatured: false,
    tags: ["bedroom", "amenities", "mini-kitchen"],
  },
  {
    alt: "Bathroom — LED backlit mirror, marble tiles, vessel sink",
    section: "gallery",
    order: 4,
    isFeatured: false,
    tags: ["bathroom", "marble", "mirror"],
  },
  {
    alt: "Bathroom — full view with herringbone floor and wall-hung toilet",
    section: "gallery",
    order: 5,
    isFeatured: false,
    tags: ["bathroom", "herringbone", "full-view"],
  },
  {
    alt: "Balcony — long geometric-tiled balcony with green tree view",
    section: "gallery",
    order: 6,
    isFeatured: false,
    tags: ["balcony", "outdoor", "greenery"],
  },
  {
    alt: "Co-working lounge — glass walls, blue velvet chairs, yellow mural",
    section: "gallery",
    order: 7,
    isFeatured: false,
    tags: ["co-working", "common-area", "lounge"],
  },
  {
    alt: "Co-working lounge — second angle showing room 001 door",
    section: "gallery",
    order: 8,
    isFeatured: false,
    tags: ["co-working", "common-area"],
  },
  {
    alt: "Reception desk — sofa, CCTV monitor and AC unit",
    section: "gallery",
    order: 9,
    isFeatured: false,
    tags: ["reception", "lobby"],
  },
  {
    alt: "LED-lit glass wardrobe — open with fresh towels and garden view",
    section: "gallery",
    order: 10,
    isFeatured: false,
    tags: ["wardrobe", "detail", "towels"],
  },
  {
    alt: "Floor corridor — elevator, marble staircase, room 404",
    section: "gallery",
    order: 11,
    isFeatured: false,
    tags: ["corridor", "elevator", "common-area"],
  },
];

async function readImageAsBase64(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
  return `data:${mime};base64,${base64}`;
}

async function main() {
  console.log("📸 Looking for Sector 57 photos in public/images/s57/ ...\n");

  const imageDir = path.join(process.cwd(), "public", "images", "s57");

  if (!fs.existsSync(imageDir)) {
    console.log("❌ Directory not found: public/images/s57/");
    console.log("\n📁 Please do this:");
    console.log("   1. Create the folder:  public/images/s57/");
    console.log("   2. Save the 16 photos there as: 01.jpg, 02.jpg ... 16.jpg");
    console.log("   3. Run this script again: npx tsx prisma/seed-photos-s57.ts\n");
    console.log("💡 The filenames map to these photos:");
    PHOTOS.forEach((p, i) => {
      console.log(`   ${String(i + 1).padStart(2, "0")}.jpg → ${p.alt}`);
    });
    await prisma.$disconnect();
    return;
  }

  const files = fs.readdirSync(imageDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log("❌ No image files found in public/images/s57/");
    await prisma.$disconnect();
    return;
  }

  console.log(`✅ Found ${files.length} image file(s). Inserting into DB...\n`);

  // Delete existing Sector 57 photos first to avoid duplicates
  const deleted = await prisma.photo.deleteMany({ where: { propertyId: "1" } });
  if (deleted.count > 0) console.log(`🗑️  Removed ${deleted.count} existing Sector 57 photos`);

  let inserted = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = PHOTOS[i] ?? {
      alt: `Sector 57 — photo ${i + 1}`,
      section: "gallery",
      order: i + 10,
      isFeatured: false,
      tags: [],
    };

    const filePath = path.join(imageDir, file);
    const dataUrl = await readImageAsBase64(filePath);

    await prisma.photo.create({
      data: {
        url: dataUrl,
        alt: meta.alt,
        propertyId: "1",
        section: meta.section,
        order: meta.order,
        isFeatured: meta.isFeatured,
        tags: [...meta.tags, "sector-57", "sushant-lok"],
        uploadedAt: new Date().toISOString(),
      },
    });

    console.log(`  ✓ [${String(i + 1).padStart(2, "0")}] ${meta.alt.substring(0, 60)}`);
    inserted++;
  }

  console.log(`\n🎉 Done! ${inserted} photo(s) seeded for Sector 57.`);
  console.log("   → Visit /homes/sushant-lok to see them live.\n");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
