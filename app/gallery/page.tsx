"use client";

import { useEffect, useState } from "react";
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

const CATEGORIES = ["All", "Sushant Lok", "Jharsa Village", "Interiors", "Details", "Lifestyle"];

const SECTION_MAP: Record<string, string[]> = {
  "All": [],
  "Sushant Lok": ["sushant-lok", "property-hero"],
  "Jharsa Village": ["jharsa-village"],
  "Interiors": ["interiors", "interior"],
  "Details": ["details", "detail"],
  "Lifestyle": ["lifestyle"],
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPhotos(data);
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

  const filteredReal = useReal
    ? photos.filter((p) => {
        if (activeCategory === "All") return true;
        const sections = SECTION_MAP[activeCategory] ?? [];
        return sections.some((s) => p.section?.includes(s) || p.tags?.includes(s));
      })
    : [];

  const filteredFallback = !useReal
    ? FALLBACK_IMAGES.filter((img) => {
        if (activeCategory === "All") return true;
        const sections = SECTION_MAP[activeCategory] ?? [];
        return sections.some((s) => img.section?.includes(s));
      })
    : [];

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-16 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-gold text-sm tracking-widest uppercase mb-6 animate-fade-in">Gallery</p>
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">A Visual Story</h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">Every corner, every detail, every moment captured.</p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="pb-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {CATEGORIES.map((category) => (
                <button key={category} onClick={() => setActiveCategory(category)}
                  className={cn("px-6 py-2 text-sm font-medium transition-all duration-300",
                    activeCategory === category ? "bg-forest text-cream" : "bg-cream text-forest border border-forest/20 hover:border-forest")}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-24 px-6">
          <div className="container mx-auto max-w-7xl">
            {useReal ? (
              filteredReal.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredReal.map((photo, i) => (
                    <div key={photo.id} className="reveal image-hover" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="aspect-square overflow-hidden bg-neutral-100">
                        <img src={photo.url} alt={photo.alt || "Gallery photo"} className="w-full h-full object-cover" />
                      </div>
                      {photo.alt && (
                        <p className="text-xs font-mono text-ink/50 mt-1 px-1 truncate">{photo.alt}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-ink/50 py-16">No photos in this category.</p>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFallback.map((image, i) => (
                  <div key={image.id} className="reveal image-hover" style={{ animationDelay: `${i * 50}ms` }}>
                    <PlaceholderImage caption={image.caption} aspectRatio="portrait" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
