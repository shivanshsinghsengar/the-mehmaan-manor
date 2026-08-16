import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const photos = await prisma.photo.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  
  console.log(`TOTAL: ${photos.length} photos\n`);
  
  // Show unassigned (propertyId = null) or recently uploaded
  const unassigned = photos.filter(p => !p.propertyId || p.propertyId === null);
  const s39 = photos.filter(p => p.propertyId === "2");
  const s57 = photos.filter(p => p.propertyId === "1");
  
  console.log(`--- Unassigned (${unassigned.length}) ---`);
  unassigned.forEach(x => console.log(`  [${x.id}] section=${x.section}  alt="${x.alt}"`));
  
  console.log(`\n--- Sector 39 (${s39.length}) ---`);
  s39.forEach(x => console.log(`  [${x.id}] section=${x.section}  alt="${x.alt?.substring(0,50)}"`));
  
  console.log(`\n--- Sector 57 (${s57.length}) ---`);
  s57.forEach(x => console.log(`  [${x.id}] section=${x.section}  alt="${x.alt?.substring(0,50)}"`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
