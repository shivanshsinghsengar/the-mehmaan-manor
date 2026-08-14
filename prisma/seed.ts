/**
 * Seed script — The Mehmaan Manor
 * Run with: npx ts-node --project tsconfig.json prisma/seed.ts
 * Or:       npx prisma db seed
 *
 * Populates: Property × 2, SiteContent × 1
 * Photos are added separately via the admin panel.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding The Mehmaan Manor database...\n");

  // ── 1. Upsert Site Content ───────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "The Mehmaan Experience",
      heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText:
        "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship. Two beautifully curated homes. One unforgettable promise. This isn't a hotel. This is your Mehmaan moment.",
      taglinePrimary: "Not just a stay — it's the Mehmaan experience.",
      taglineSecondary: "Two homes. One promise. Endless memories.",
      taglineCloser: "Come as a guest, leave as family.",
      instagramHandle: "@themehmaanmanor",
      teamSimranPhone: "8828352311",
      teamVipinPhone: "8796568003",
      teamJyotiPhone: "8796568002",
    },
  });
  console.log("✅ Site content seeded");

  // ── 2. Upsert Property 1 — Sushant Lok ──────────────────────────────────
  await prisma.property.upsert({
    where: { id: "1" },
    update: {
      name: "The Mehmaan Manor — Sector 57",
      slug: "sushant-lok",
      address: "Building No. G-219, G-Block, Sushant Lok-2, Sector 57, Gurugram, Haryana — 122011",
      coordinates: "28.4233° N, 77.0890° E",
      description: "A warm, peaceful urban retreat with stylish interiors — feels like home from the moment you arrive.",
      vibe:
        "A warm, peaceful, and welcoming stay with a comfortable atmosphere, stylish interiors, and a relaxing environment that feels like a home away from home. Ideal for both short getaways and extended work stays in Gurugram.",
      baseRate: 2499,
      weekendRate: 2799,
      cleaningFee: 0,
      maxGuests: 3,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: [
        "High-Speed Wi-Fi",
        "Smart TV with Netflix",
        "Air Conditioning",
        "24/7 Hot Water",
        "Balcony",
        "CCTV Security",
        "24-Hour Power Backup",
        "Street Parking",
      ],
      policies:
        "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest.",
      cancellationPolicy: "Moderate",
      guestRules: JSON.stringify({
        "Pets allowed": false,
        "Smoking allowed": false,
        "Events allowed": false,
        "Children welcome": true,
        "Visitors allowed (10AM–8PM)": true,
        "Late check-in available": false,
      }),
      blockedDates: [],
      isActive: true,
    },
    create: {
      id: "1",
      name: "The Mehmaan Manor — Sector 57",
      slug: "sushant-lok",
      address: "Building No. G-219, G-Block, Sushant Lok-2, Sector 57, Gurugram, Haryana — 122011",
      coordinates: "28.4233° N, 77.0890° E",
      description: "A warm, peaceful urban retreat with stylish interiors — feels like home from the moment you arrive.",
      vibe:
        "A warm, peaceful, and welcoming stay with a comfortable atmosphere, stylish interiors, and a relaxing environment that feels like a home away from home. Ideal for both short getaways and extended work stays in Gurugram.",
      baseRate: 2499,
      weekendRate: 2799,
      cleaningFee: 0,
      maxGuests: 3,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: [
        "High-Speed Wi-Fi",
        "Smart TV with Netflix",
        "Air Conditioning",
        "24/7 Hot Water",
        "Balcony",
        "CCTV Security",
        "24-Hour Power Backup",
        "Street Parking",
      ],
      policies:
        "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest.",
      cancellationPolicy: "Moderate",
      guestRules: JSON.stringify({
        "Pets allowed": false,
        "Smoking allowed": false,
        "Events allowed": false,
        "Children welcome": true,
        "Visitors allowed (10AM–8PM)": true,
        "Late check-in available": false,
      }),
      blockedDates: [],
      isActive: true,
    },
  });
  console.log("✅ Property 1 seeded — The Mehmaan Manor Sector 57 (Sushant Lok)");

  // ── 3. Upsert Property 2 — Jharsa Village / Sector 39 ───────────────────
  await prisma.property.upsert({
    where: { id: "2" },
    update: {
      name: "The Mehmaan Manor — Sector 39",
      slug: "jharsa-village",
      address: "Building No. 593, Durga Colony, Jharsa Road, Near Unitech Cyber Park, Sector 39, Gurugram, Haryana — 122003",
      coordinates: "28.4396° N, 77.0525° E",
      description: "Fully furnished, centrally located — your peaceful base near Medanta and the metro.",
      vibe:
        "A warm, peaceful, and welcoming stay with a comfortable atmosphere and a relaxing environment that feels like a home away from home. Conveniently located near Medanta Hospital and Millennium City Centre Metro Station. Available as a Studio (up to 3 guests) or a spacious 2.5 BHK (up to 5 guests) — ideal for families, working professionals, and corporate guests.",
      baseRate: 1999,
      weekendRate: 2299,
      cleaningFee: 0,
      maxGuests: 5,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: [
        "High-Speed Wi-Fi",
        "Smart TV with Netflix",
        "Air Conditioning",
        "24/7 Hot Water",
        "Basic Kitchen (Utensils Provided)",
        "Balcony",
        "CCTV Security",
        "24-Hour Power Backup",
        "Street Parking",
        "Near Medanta Hospital",
        "Near Metro Station",
      ],
      policies:
        "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest in Studio. Studio max 3 guests · 2.5 BHK max 5 guests.",
      cancellationPolicy: "Moderate",
      guestRules: JSON.stringify({
        "Pets allowed": false,
        "Smoking allowed": false,
        "Events allowed": false,
        "Children welcome": true,
        "Visitors allowed (10AM–8PM)": true,
        "Late check-in available": false,
      }),
      blockedDates: [],
      isActive: true,
    },
    create: {
      id: "2",
      name: "The Mehmaan Manor — Sector 39",
      slug: "jharsa-village",
      address: "Building No. 593, Durga Colony, Jharsa Road, Near Unitech Cyber Park, Sector 39, Gurugram, Haryana — 122003",
      coordinates: "28.4396° N, 77.0525° E",
      description: "Fully furnished, centrally located — your peaceful base near Medanta and the metro.",
      vibe:
        "A warm, peaceful, and welcoming stay with a comfortable atmosphere and a relaxing environment that feels like a home away from home. Conveniently located near Medanta Hospital and Millennium City Centre Metro Station. Available as a Studio (up to 3 guests) or a spacious 2.5 BHK (up to 5 guests) — ideal for families, working professionals, and corporate guests.",
      baseRate: 1999,
      weekendRate: 2299,
      cleaningFee: 0,
      maxGuests: 5,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: [
        "High-Speed Wi-Fi",
        "Smart TV with Netflix",
        "Air Conditioning",
        "24/7 Hot Water",
        "Basic Kitchen (Utensils Provided)",
        "Balcony",
        "CCTV Security",
        "24-Hour Power Backup",
        "Street Parking",
        "Near Medanta Hospital",
        "Near Metro Station",
      ],
      policies:
        "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest in Studio. Studio max 3 guests · 2.5 BHK max 5 guests.",
      cancellationPolicy: "Moderate",
      guestRules: JSON.stringify({
        "Pets allowed": false,
        "Smoking allowed": false,
        "Events allowed": false,
        "Children welcome": true,
        "Visitors allowed (10AM–8PM)": true,
        "Late check-in available": false,
      }),
      blockedDates: [],
      isActive: true,
    },
  });
  console.log("✅ Property 2 seeded — The Mehmaan Manor Sector 39 (Jharsa Village)\n");

  console.log("🎉 Seeding complete!");
  console.log("\n📸 Next step: Upload property photos via the admin panel.");
  console.log("   → Go to /admin/properties → click Edit → Photos tab → drag & drop.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
