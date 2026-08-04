// Server Component — fetches data before rendering, no loading flash
import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./homepage-client";

export default async function HomePage() {
  // Fetch all data server-side — arrives pre-loaded, zero blank flash
  const [properties, photos, content] = await Promise.all([
    prisma.property.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }).catch(() => []),
    prisma.photo.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.siteContent.findUnique({ where: { id: "singleton" } }).catch(() => null),
  ]);

  // Build property card photos map
  const propertyCards: Record<string, { url: string; alt: string }[]> = {};
  for (const p of properties) {
    propertyCards[p.id] = photos
      .filter((ph) => ph.propertyId === p.id && ph.section === "property-card")
      .map((ph) => ({ url: ph.url, alt: ph.alt }));
  }

  const siteData = {
    properties: properties.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      address: p.address,
      coordinates: p.coordinates,
      vibe: p.vibe,
      baseRate: p.baseRate,
    })),
    heroPhotos: photos.filter((p) => p.section === "hero").map((p) => ({ url: p.url, alt: p.alt })),
    instagramPhotos: photos.filter((p) => p.section === "instagram").map((p) => ({ url: p.url, alt: p.alt })),
    propertyCards,
    content: {
      heroHeadline: content?.heroHeadline || "The Mehmaan Experience",
      heroSubtitle: content?.heroSubtitle || "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText: content?.philosophyText || "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship.",
      taglineCloser: content?.taglineCloser || "Come as a guest, leave as family.",
    },
  };

  return <HomePageClient siteData={siteData} />;
}
