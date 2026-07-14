import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Upsert properties
  await prisma.property.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Sushant Lok",
      slug: "sushant-lok",
      address: "Sector 57, Phase 2, Sushant Lok, Gurugram, Haryana",
      coordinates: "28.4212° N, 77.0761° E",
      description: "Your peaceful retreat in the heart of Gurugram",
      vibe: "Peaceful surroundings, great connectivity — perfect for work or to unwind.",
      baseRate: 4500,
      weekendRate: 5500,
      cleaningFee: 500,
      maxGuests: 6,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Fully Equipped Kitchen","Air Conditioning","Dedicated Workspace","24/7 Hot Water","Free Parking","Garden Access","Security System","Spacious Living Area"],
      policies: "No smoking indoors. Pets negotiable. Quiet hours 10 PM – 8 AM.",
      isActive: true,
    },
  });

  await prisma.property.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      name: "Jharsa Village",
      slug: "jharsa-village",
      address: "593, Durga Colony, Jharsa Village, Sector 39, Gurugram, Haryana - 122003",
      coordinates: "28.4594° N, 77.0266° E",
      description: "Your cozy neighborhood escape",
      vibe: "Cozy neighborhood, close to everything — your happy place in the city.",
      baseRate: 4000,
      weekendRate: 5000,
      cleaningFee: 500,
      maxGuests: 4,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Modern Kitchen","Air Conditioning","Work-Friendly Setup","24/7 Hot Water","Street Parking","Local Market Nearby","Safe Neighborhood","Cozy Living Space"],
      policies: "No smoking indoors. Pets negotiable. Quiet hours 10 PM – 8 AM.",
      isActive: true,
    },
  });

  // Upsert site content
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "The Mehmaan Experience",
      heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText: "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship. Two beautifully curated homes. One unforgettable promise.",
      taglinePrimary: "Not just a stay — it's the Mehmaan experience.",
      taglineSecondary: "Two homes. One promise. Endless memories.",
      taglineCloser: "Come as a guest, leave as family.",
      instagramHandle: "@themehmaanmanor",
      teamSimranPhone: "8828352311",
      teamVipinPhone: "8796568003",
      teamJyotiPhone: "8796568002",
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
