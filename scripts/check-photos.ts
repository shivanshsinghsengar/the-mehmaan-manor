import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const photos = await p.photo.findMany();
  console.log("TOTAL:", photos.length, "photos");
  
  const byProp: Record<string, { section: string; alt: string; id: string }[]> = {};
  photos.forEach((x) => {
    const k = x.propertyId || "null";
    if (!byProp[k]) byProp[k] = [];
    byProp[k].push({ section: x.section, alt: x.alt?.substring(0, 50) || "", id: x.id });
  });
  
  Object.entries(byProp).forEach(([k, v]) => {
    console.log(`\n--- propertyId = ${k} (${v.length} photos) ---`);
    v.forEach((x) => console.log(`  [${x.id}] section=${x.section}  alt="${x.alt}"`));
  });
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
