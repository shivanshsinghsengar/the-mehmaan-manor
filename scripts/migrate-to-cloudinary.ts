/**
 * Migrates all base64 photos from DB to Cloudinary.
 * Run: npx tsx scripts/migrate-to-cloudinary.ts
 */
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: "pdqt9y1o",
  api_key: "659975391527599",
  api_secret: "POumMRkvWBG2kU9odTks-1fb9Q4",
});

async function main() {
  console.log("🚀 Starting Cloudinary migration...\n");

  const photos = await prisma.photo.findMany();
  console.log(`Found ${photos.length} photos to process\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const photo of photos) {
    // Skip if already a Cloudinary URL
    if (photo.url.startsWith("https://res.cloudinary.com")) {
      console.log(`  ⏭  Already Cloudinary: ${photo.id}`);
      skipped++;
      continue;
    }

    // Skip if not base64
    if (!photo.url.startsWith("data:")) {
      console.log(`  ⏭  External URL, skip: ${photo.id}`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`  ↑  Uploading [${photo.id}] ${photo.alt?.substring(0, 40)}... `);

      const result = await cloudinary.uploader.upload(photo.url, {
        folder: "mehman-manor",
        public_id: photo.id,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });

      await prisma.photo.update({
        where: { id: photo.id },
        data: { url: result.secure_url },
      });

      console.log(`✓ ${result.secure_url.substring(0, 60)}`);
      migrated++;

      // Small delay to avoid rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : JSON.stringify(err);
      console.log(`✗ FAILED: ${msg}`);
      failed++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Migrated: ${migrated}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Failed:   ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
