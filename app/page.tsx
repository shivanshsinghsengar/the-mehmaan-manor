// Server Component — fetches data before rendering, no loading flash
import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./homepage-client";
import { heroImageUrl } from "@/lib/cloudinary";

export default async function HomePage() {
  // Fetch all data server-side — arrives pre-loaded, zero blank flash
  // Only fetch photos needed for homepage sections to keep payload small
  const [properties, heroPhotos, instagramPhotos, propertyCardPhotos, content] = await Promise.all([
    prisma.property.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }).catch(() => []),
    prisma.photo.findMany({ where: { section: "hero" }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.photo.findMany({ where: { section: "instagram" }, orderBy: { order: "asc" }, take: 6 }).catch(() => []),
    prisma.photo.findMany({ where: { section: "property-card" }, orderBy: { order: "asc" }, take: 6 }).catch(() => []),
    prisma.siteContent.findUnique({ where: { id: "singleton" } }).catch(() => null),
  ]);

  // Also fetch gallery photos for instagram fallback (limit 6)
  const galleryPhotos = instagramPhotos.length >= 6
    ? []
    : await prisma.photo.findMany({ where: { section: "gallery" }, orderBy: { order: "asc" }, take: 6 - instagramPhotos.length }).catch(() => []);

  const allInstagram = [...instagramPhotos, ...galleryPhotos].slice(0, 6);

  // Build property card photos map
  const propertyCards: Record<string, { url: string; alt: string }[]> = {};
  for (const p of properties) {
    propertyCards[p.id] = propertyCardPhotos
      .filter((ph) => ph.propertyId === p.id)
      .map((ph) => ({ url: ph.url, alt: ph.alt }));
  }

  // First hero image URL — used for <link rel="preload"> to improve LCP
  const firstHeroUrl =
    heroPhotos[0]?.url ||
    (content?.heroMediaUrl ? content.heroMediaUrl : null);

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
    heroPhotos: heroPhotos.map((p) => ({ url: p.url, alt: p.alt })),
    instagramPhotos: allInstagram.map((p) => ({ url: p.url, alt: p.alt })),
    galleryPhotos: allInstagram.map((p) => ({ url: p.url, alt: p.alt })),
    propertyCards,
    content: {
      heroHeadline: content?.heroHeadline || "The Mehmaan Experience",
      heroSubtitle: content?.heroSubtitle || "Two homes in Gurugram. Endless ways to feel at home.",
      philosophyText: content?.philosophyText || "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship.",
      taglineCloser: content?.taglineCloser || "Come as a guest, leave as family.",
      heroMediaUrl: content?.heroMediaUrl || "",
      heroMediaType: content?.heroMediaType || "photo",
    },
    discountPercent: content?.discountPercent ?? 0,
    activeFestival: content?.activeFestival ?? "",
    discountActive: content?.discountActive ?? false,
  };

  return (
    <>
      {/*
        Preload the first hero image as early as possible in the HTML stream.
        This tells the browser to fetch it at highest priority immediately,
        before any JS executes — the single biggest LCP win.
      */}
      {firstHeroUrl && (
        <link
          rel="preload"
          as="image"
          href={heroImageUrl(firstHeroUrl)}
          fetchPriority="high"
        />
      )}
      <HomePageClient siteData={siteData} />
    </>
  );
}
