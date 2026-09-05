"use client";

import { useEffect, useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  url: string;
  alt: string;
  section: string;
  propertyId: string | null;
  isFeatured: boolean;
  tags: string[];
};

/** Human-readable label for a raw section slug */
function sectionLabel(section: string): string {
  const MAP: Record<string, string> = {
    "sushant-lok": "Sushant Lok",
    "jharsa-village": "Jharsa Village",
    "property-hero": "Properties",
    "property-card": "Properties",
    "interiors": "Interiors",
    "interior": "Interiors",
    "details": "Details",
    "detail": "Details",
    "lifestyle": "Lifestyle",
    "hero": "Hero",
    "instagram": "Instagram",
    "gallery": "Gallery",
  };
  if (MAP[section]) return MAP[section];
  // Fallback: title-case the slug
  return section
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const FALLBACK_IMAGES = [
  { id: "f1", caption: "SUSHANT LOK — Exterior dusk view", section: "sushant-lok" },
  { id: "f2", caption: "INTERIOR — Living room warmth", section: "interiors" },
  { id: "f3", caption: "DETAIL — Brass fixture close-up", section: "details" },
  { id: "f4", caption: "JHARSA — Cozy exterior", section: "jharsa-village" },
  { id: "f5", caption: "LIFESTYLE — Morning coffee moment", section: "lifestyle" },
  { id: "f6", caption: "INTERIOR — Bedroom sanctuary", section: "interiors" },
  { id: "f7", caption: "DETAIL — Ceramic vessel, textile", section: "details" },
  { id: "f8", caption: "SUSHANT LOK — Garden area", section: "sushant-lok" },
  { id: "f9", caption: "LIFESTYLE — Guest reading by window", section: "lifestyle" },
  { id: "f10", caption: "INTERIOR — Kitchen modern", section: "interiors" },
  { id: "f11", caption: "JHARSA — Neighborhood character", section: "jharsa-village" },
  { id: "f12", caption: "DETAIL — Textured throws, plants", section: "details" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Only fetch gallery-relevant sections for public display
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out hero section from gallery display
          setPhotos(data.filter((p: { section: string }) =>
            !["hero"].includes(p.section)
          ));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos, loaded]);

  const useReal = loaded && photos.length > 0;

  /**
   * Build category tabs dynamically from the sections that actually exist in the photos.
   * Deduplicate by label so "interiors" and "interior" collapse into one "Interiors" tab.
   */
  const categories = useMemo(() => {
    if (!useReal) {
      // Static fallback categories
      return ["All", "Sushant Lok", "Jharsa Village", "Interiors", "Details", "Lifestyle"];
    }
    const labelSet = new Set<string>();
    for (const photo of photos) {
      const label = sectionLabel(photo.section);
      // Skip internal/admin sections from public tabs
      if (["Hero", "Instagram"].includes(label)) continue;
      labelSet.add(label);
    }
    return ["All", ...Array.from(labelSet).sort()];
  }, [photos, useReal]);

  // Reset to "All" when available categories change and the current one is no longer present
  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [categories, activeCategory]);

  const filteredReal = useMemo(() => {
    if (!useReal) return [];
    if (activeCategory === "All") return photos;
    return photos.filter((p) => {
      const label = sectionLabel(p.section);
      return label === activeCategory;
    });
  }, [photos, useReal, activeCategory]);

  const filteredFallback = useMemo(() => {
    if (useReal) return [];
    if (activeCategory === "All") return FALLBACK_IMAGES;
    return FALLBACK_IMAGES.filter((img) => sectionLabel(img.section) === activeCategory);
  }, [useReal, activeCategory]);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-8 md:pb-12 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="label-badge text-gold">Gallery</span>
            <h1 className="font-display text-display text-forest mt-3 mb-3">A Visual Story</h1>
            <p className="text-base text-ink/65 max-w-xl mx-auto">Every corner, every detail, every moment captured.</p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-5 px-4 md:px-6 bg-white border-b border-forest/8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-h-[36px]",
                    activeCategory === category
                      ? "bg-forest text-cream shadow-sm"
                      : "bg-[#faf8f4] text-ink/60 border border-forest/10 hover:border-forest/30 hover:text-forest"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {!loaded && (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-mono text-sm text-ink/40">Loading photos…</p>
              </div>
            )}

            {useReal && (
              filteredReal.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {filteredReal.map((photo, i) => (
                    <div key={photo.id} className="reveal image-hover rounded-xl overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="aspect-square bg-[#eee9df]">
                        <img
                          src={photo.url}
                          alt={photo.alt || "Gallery photo"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      {photo.alt && (
                        <p className="text-xs font-mono text-ink/40 mt-1 px-1 truncate">{photo.alt}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="w-14 h-14 bg-[#eee9df] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <h3 className="font-display text-xl text-forest mb-2">Photos coming soon</h3>
                  <p className="text-ink/45 text-sm max-w-xs mx-auto">
                    {activeCategory === "All"
                      ? "No photos have been uploaded yet. Check back soon."
                      : `No photos in "${activeCategory}" yet.`}
                  </p>
                  {activeCategory !== "All" && (
                    <button onClick={() => setActiveCategory("All")} className="mt-5 font-mono text-sm text-gold hover:underline">
                      ← View all photos
                    </button>
                  )}
                </div>
              )
            )}

            {loaded && !useReal && (
              filteredFallback.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {filteredFallback.map((image, i) => (
                    <div key={image.id} className="reveal image-hover rounded-xl overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
                      <PlaceholderImage caption={image.caption} aspectRatio="portrait" variant="light" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <h3 className="font-display text-xl text-forest mb-2">Photos coming soon</h3>
                  <p className="text-ink/45 text-sm">
                    {activeCategory === "All" ? "No photos yet." : `No photos in "${activeCategory}" yet.`}
                  </p>
                  {activeCategory !== "All" && (
                    <button onClick={() => setActiveCategory("All")} className="mt-5 font-mono text-sm text-gold hover:underline">
                      ← View all photos
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
